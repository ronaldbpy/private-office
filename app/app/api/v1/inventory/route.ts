import { prisma } from "@/lib/prisma";
import { getUserAccess, accessibleEntityIds } from "@/lib/access";
import { getAuthUserId } from "@/lib/api-auth";
import { NextResponse } from "next/server";
import { Decimal } from "@prisma/client/runtime/library";

export async function GET(req: Request) {
  try {
    const userId = await getAuthUserId();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const access = await getUserAccess(userId);
    const entityIds = accessibleEntityIds(access);

    const inventory = await prisma.inventoryItem.findMany({
      where: { entityId: { in: entityIds } },
      include: { product: true, entity: true },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ inventory });
  } catch (error) {
    console.error("GET /api/v1/inventory error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const userId = await getAuthUserId();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    const { entityId, productId, quantity, location, status, notes } = body;

    if (!entityId || !productId || quantity === undefined) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 422 });
    }

    const access = await getUserAccess(userId);
    const entityIds = accessibleEntityIds(access);

    if (!entityIds.includes(entityId)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const item = await prisma.inventoryItem.create({
      data: {
        entityId,
        productId,
        quantity: new Decimal(quantity),
        location,
        status: status || "available",
        notes,
      },
      include: { product: true, entity: true },
    });

    return NextResponse.json({ item }, { status: 201 });
  } catch (error) {
    console.error("POST /api/v1/inventory error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
