import { prisma } from "@/lib/prisma";
import { getUserAccess, accessibleEntityIds } from "@/lib/access";
import { getAuthUserId } from "@/lib/api-auth";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const userId = await getAuthUserId();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const access = await getUserAccess(userId);
    const entityIds = accessibleEntityIds(access);

    if (entityIds.length === 0) {
      return NextResponse.json({ obligations: [], dueRules: [] });
    }

    const obligations = await prisma.obligation.findMany({
      where: { entityId: { in: entityIds } },
      include: {
        entity: {
          select: { id: true, name: true, colorToken: true },
        },
        dueRule: true,
      },
      orderBy: [{ entity: { name: "asc" } }, { code: "asc" }],
    });

    return NextResponse.json({ obligations });
  } catch (error) {
    console.error("GET /api/v1/obligations error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
