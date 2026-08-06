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
      return NextResponse.json({ accounts: [] });
    }

    const accounts = await prisma.account.findMany({
      where: { entityId: { in: entityIds } },
      include: {
        entity: {
          select: { id: true, name: true, colorToken: true },
        },
        balances: {
          orderBy: { createdAt: "desc" },
          take: 1,
        },
      },
      orderBy: [{ entity: { name: "asc" } }, { accountName: "asc" }],
    });

    // Mapear Decimal a número para JSON
    const serialized = accounts.map((acc) => ({
      ...acc,
      balances: acc.balances.map((bal) => ({
        ...bal,
        amount: bal.amount.toNumber(),
      })),
    }));

    return NextResponse.json({ accounts: serialized });
  } catch (error) {
    console.error("GET /api/v1/accounts error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
