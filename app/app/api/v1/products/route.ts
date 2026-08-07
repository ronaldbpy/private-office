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

    const products = await prisma.product.findMany({
      where: { entityId: { in: entityIds } },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ products });
  } catch (error) {
    console.error("GET /api/v1/products error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const userId = await getAuthUserId();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    const { entityId, code, name, description, category, unitPrice, cost, quantity, unit, taxRate } = body;

    if (!entityId || !code || !name || !unitPrice) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 422 });
    }

    const access = await getUserAccess(userId);
    const entityIds = accessibleEntityIds(access);

    if (!entityIds.includes(entityId)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const product = await prisma.product.create({
      data: {
        entityId,
        code,
        name,
        description,
        category,
        unitPrice: typeof unitPrice === "string" ? parseFloat(unitPrice) : unitPrice,
        cost: cost ? (typeof cost === "string" ? parseFloat(cost) : cost) : null,
        quantity: quantity || 0,
        unit: unit || "unidad",
        taxRate: taxRate ? (typeof taxRate === "string" ? parseFloat(taxRate) : taxRate) : 10,
      },
    });

    return NextResponse.json({ product }, { status: 201 });
  } catch (error) {
    console.error("POST /api/v1/products error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
