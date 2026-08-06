import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { getUserAccess, accessibleEntityIds } from "@/lib/access";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const access = await getUserAccess(userId);
    const entityIds = accessibleEntityIds(access);

    // Verificar acceso a la cuenta (via su entidad)
    const account = await prisma.account.findUnique({
      where: { id: params.id },
    });

    if (!account || !entityIds.includes(account.entityId)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const fullAccount = await prisma.account.findUnique({
      where: { id: params.id },
      include: {
        entity: {
          select: { id: true, name: true, colorToken: true },
        },
        balances: {
          orderBy: { createdAt: "desc" },
          take: 12, // últimos 12 meses
        },
        movements: {
          orderBy: { transactionDate: "desc" },
          take: 50, // últimos 50 movimientos
        },
      },
    });

    if (!fullAccount) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    // Serializar Decimal
    return NextResponse.json({
      account: {
        ...fullAccount,
        balances: fullAccount.balances.map((b) => ({
          ...b,
          amount: b.amount.toNumber(),
        })),
        movements: fullAccount.movements.map((m) => ({
          ...m,
          amount: m.amount.toNumber(),
        })),
      },
    });
  } catch (error) {
    console.error(`GET /api/v1/accounts/${params.id} error:`, error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
