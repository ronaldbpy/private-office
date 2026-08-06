import { prisma } from "@/lib/prisma";
import { getUserAccess, accessibleEntityIds } from "@/lib/access";
import { getAuthUserId } from "@/lib/api-auth";
import { NextResponse } from "next/server";

const DEFAULT_TAKE = 50;

export async function GET(req: Request) {
  try {
    const userId = await getAuthUserId();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const access = await getUserAccess(userId);
    const entityIds = accessibleEntityIds(access);

    if (entityIds.length === 0) {
      return NextResponse.json({ events: [], total: 0 });
    }

    // Parsear query params
    const url = new URL(req.url);
    const skip = parseInt(url.searchParams.get("skip") || "0");
    const take = parseInt(url.searchParams.get("take") || DEFAULT_TAKE.toString());
    const entityId = url.searchParams.get("entityId");

    // Validar
    const safeTake = Math.min(take, 200);
    const safeSkip = Math.max(skip, 0);

    // Si se solicita una entidad específica, verificar acceso
    let whereClause: any = {
      OR: [
        { entityId: { in: entityIds } },
        { entityId: null }, // eventos globales
      ],
    };

    if (entityId && entityIds.includes(entityId)) {
      whereClause = {
        OR: [{ entityId }, { entityId: null }],
      };
    }

    const [events, total] = await Promise.all([
      prisma.timelineEvent.findMany({
        where: whereClause,
        include: {
          entity: {
            select: { id: true, name: true, colorToken: true },
          },
        },
        orderBy: { createdAt: "desc" },
        skip: safeSkip,
        take: safeTake,
      }),
      prisma.timelineEvent.count({ where: whereClause }),
    ]);

    // Parsear changes JSON
    const serialized = events.map((event) => ({
      ...event,
      changes: event.changes ? JSON.parse(event.changes) : null,
    }));

    return NextResponse.json({
      events: serialized,
      total,
      skip: safeSkip,
      take: safeTake,
    });
  } catch (error) {
    console.error("GET /api/v1/timeline error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
