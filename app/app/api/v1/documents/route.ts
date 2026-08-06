import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { getUserAccess, accessibleEntityIds } from "@/lib/access";
import { NextResponse } from "next/server";

const DEFAULT_TAKE = 20;

export async function GET(req: Request) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const access = await getUserAccess(userId);
    const entityIds = accessibleEntityIds(access);

    if (entityIds.length === 0) {
      return NextResponse.json({ documents: [], total: 0 });
    }

    // Parsear query params
    const url = new URL(req.url);
    const skip = parseInt(url.searchParams.get("skip") || "0");
    const take = parseInt(url.searchParams.get("take") || DEFAULT_TAKE.toString());

    // Validar
    const safeTake = Math.min(take, 100); // máximo 100 por request
    const safeSkip = Math.max(skip, 0);

    const [documents, total] = await Promise.all([
      prisma.document.findMany({
        where: {
          entityLinks: {
            some: { entityId: { in: entityIds } },
          },
        },
        include: {
          entityLinks: {
            include: { entity: { select: { id: true, name: true } } },
          },
        },
        orderBy: { createdAt: "desc" },
        skip: safeSkip,
        take: safeTake,
      }),
      prisma.document.count({
        where: {
          entityLinks: {
            some: { entityId: { in: entityIds } },
          },
        },
      }),
    ]);

    return NextResponse.json({
      documents,
      total,
      skip: safeSkip,
      take: safeTake,
    });
  } catch (error) {
    console.error("GET /api/v1/documents error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
