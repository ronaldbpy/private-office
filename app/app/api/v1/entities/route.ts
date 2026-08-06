import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { getUserAccess, accessibleEntityIds } from "@/lib/access";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const access = await getUserAccess(userId);
    const entityIds = accessibleEntityIds(access);

    if (entityIds.length === 0) {
      return NextResponse.json({ entities: [] });
    }

    const entities = await prisma.entity.findMany({
      where: { id: { in: entityIds } },
      select: {
        id: true,
        name: true,
        type: true,
        status: true,
        baseCurrency: true,
        colorToken: true,
        taxId: true,
        jurisdiction: true,
      },
      orderBy: { name: "asc" },
    });

    return NextResponse.json({ entities });
  } catch (error) {
    console.error("GET /api/v1/entities error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
