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

    const suppliers = await prisma.supplier.findMany({
      where: { entityId: { in: entityIds } },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ suppliers });
  } catch (error) {
    console.error("GET /api/v1/suppliers error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const userId = await getAuthUserId();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    const { entityId, fullName, businessName, taxId, phone, email, address, city, country, supplierType, paymentTerms, bankAccount } = body;

    if (!entityId || !fullName) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 422 });
    }

    const access = await getUserAccess(userId);
    const entityIds = accessibleEntityIds(access);

    if (!entityIds.includes(entityId)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const supplier = await prisma.supplier.create({
      data: {
        entityId,
        fullName,
        businessName,
        taxId,
        phone,
        email,
        address,
        city,
        country,
        supplierType: supplierType || "individual",
        paymentTerms,
        bankAccount,
      },
    });

    return NextResponse.json({ supplier }, { status: 201 });
  } catch (error) {
    console.error("POST /api/v1/suppliers error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
