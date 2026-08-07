import { prisma } from "@/lib/prisma";
import { getUserAccess, accessibleEntityIds } from "@/lib/access";
import { getAuthUserId } from "@/lib/api-auth";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const userId = await getAuthUserId();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const access = await getUserAccess(userId);
    const entityIds = accessibleEntityIds(access);

    const reports = await prisma.accountingReport.findMany({
      where: { entityId: { in: entityIds } },
      include: { entity: { select: { id: true, name: true } } },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ reports });
  } catch (error) {
    console.error("GET /api/v1/accounting-reports error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const userId = await getAuthUserId();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    const { entityId, reportType, period, content, htmlContent } = body;

    if (!entityId || !reportType || !period || !content) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 422 });
    }

    const access = await getUserAccess(userId);
    const entityIds = accessibleEntityIds(access);

    if (!entityIds.includes(entityId)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const report = await prisma.accountingReport.create({
      data: {
        entityId,
        reportType,
        period,
        content: typeof content === "string" ? content : JSON.stringify(content),
        htmlContent,
        createdBy: userId,
      },
      include: { entity: { select: { id: true, name: true } } },
    });

    return NextResponse.json({ report }, { status: 201 });
  } catch (error) {
    console.error("POST /api/v1/accounting-reports error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
