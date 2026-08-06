import { Anthropic } from "@anthropic-ai/sdk";
import { prisma } from "@/lib/prisma";
import { getUserAccess, accessibleEntityIds } from "@/lib/access";
import { getAuthUserId } from "@/lib/api-auth";
import { NextResponse } from "next/server";

const client = new Anthropic();

export async function GET(req: Request) {
  try {
    const userId = await getAuthUserId();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const access = await getUserAccess(userId);
    const entityIds = accessibleEntityIds(access);

    if (entityIds.length === 0) {
      return NextResponse.json({ reports: [] });
    }

    const url = new URL(req.url);
    const entityId = url.searchParams.get("entityId");

    let whereClause: any = { entityId: { in: entityIds } };
    if (entityId && entityIds.includes(entityId)) {
      whereClause = { entityId };
    }

    const reports = await prisma.intelligenceReport.findMany({
      where: whereClause,
      include: {
        entity: { select: { id: true, name: true } },
      },
      orderBy: { createdAt: "desc" },
      take: 20,
    });

    return NextResponse.json({ reports });
  } catch (error) {
    console.error("GET /api/v1/intelligence error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const userId = await getAuthUserId();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { entityId, reportType } = body;

    if (!entityId || !reportType) {
      return NextResponse.json(
        { error: "Missing required fields (entityId, reportType)" },
        { status: 422 }
      );
    }

    const access = await getUserAccess(userId);
    const entityIds = accessibleEntityIds(access);

    if (!entityIds.includes(entityId)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Traer datos de la entidad para análisis
    const entity = await prisma.entity.findUnique({
      where: { id: entityId },
      include: {
        accounts: {
          include: {
            balances: { orderBy: { createdAt: "desc" }, take: 1 },
            movements: { orderBy: { transactionDate: "desc" }, take: 10 },
          },
        },
        projects: {
          include: {
            tasks: { orderBy: { dueDate: "asc" } },
          },
        },
        obligations: {
          include: { dueRule: true },
        },
      },
    });

    if (!entity) {
      return NextResponse.json({ error: "Entity not found" }, { status: 404 });
    }

    // Preparar prompt para Claude basado en reportType
    let prompt = "";
    let title = "";

    switch (reportType) {
      case "treasury_forecast":
        title = "Pronóstico de Tesorería — 90 días";
        prompt = `
Analiza los datos de tesorería de ${entity.name} y proporciona:
1. Tendencia de flujo de caja para los próximos 90 días
2. Alertas de liquidez (si hay)
3. Recomendaciones de gestión de saldos

Datos:
- Cuentas bancarias: ${JSON.stringify(entity.accounts, null, 2)}
- Últimos movimientos: ${entity.accounts[0]?.movements.slice(0, 5).map((m) => `${m.description}: ${m.amount} ${m.direction}`).join(", ")}

Formato: Markdown, máximo 500 palabras.
        `;
        break;

      case "project_risk":
        title = "Análisis de Riesgos — Proyectos";
        prompt = `
Analiza los proyectos de ${entity.name} e identifica riesgos:

Proyectos: ${entity.projects
          .map(
            (p) =>
              `${p.title} (${p.tasks.length} tareas, status: ${p.status})`
          )
          .join(", ")}

Proporciona:
1. Principales riesgos identificados
2. Tareas críticas que podrían retrasar
3. Recomendaciones de mitigación

Formato: Markdown, máximo 500 palabras.
        `;
        break;

      case "obligation_alert":
        title = "Alertas de Obligaciones Tributarias";
        prompt = `
${entity.name} tiene estas obligaciones tributarias:
${entity.obligations
  .map((o) => `- ${o.code}: ${o.name} (confirmada: ${o.dueRule?.confirmed || false})`)
  .join("\n")}

Proporciona:
1. Obligaciones próximas a vencer
2. Las que aún no están confirmadas (riesgo)
3. Acciones recomendadas

Formato: Markdown, máximo 400 palabras.
        `;
        break;

      default:
        return NextResponse.json(
          { error: "Unknown reportType" },
          { status: 422 }
        );
    }

    // Llamar a Claude
    const message = await client.messages.create({
      model: "claude-opus-4-1-20250805",
      max_tokens: 1024,
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
    });

    const content =
      message.content[0].type === "text" ? message.content[0].text : "";

    // Guardar reporte
    const report = await prisma.intelligenceReport.create({
      data: {
        entityId,
        reportType,
        title,
        summary: content.split("\n").slice(0, 2).join(" ").substring(0, 200),
        content,
        contentType: "markdown",
        confidence: 75, // Claude es confiable, pero no es predicción 100% exacta
        requestedBy: userId,
      },
      include: {
        entity: { select: { id: true, name: true } },
      },
    });

    return NextResponse.json({ report }, { status: 201 });
  } catch (error) {
    console.error("POST /api/v1/intelligence error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
