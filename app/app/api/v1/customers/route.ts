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

    const customers = await prisma.customer.findMany({
      where: { entityId: { in: entityIds } },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ customers });
  } catch (error) {
    console.error("GET /api/v1/customers error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const userId = await getAuthUserId();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    const { entityId, fullName, businessName, taxId, phone, email, address, city, country, customerType, creditLimit } = body;

    if (!entityId || !fullName) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 422 });
    }

    const access = await getUserAccess(userId);
    const entityIds = accessibleEntityIds(access);

    if (!entityIds.includes(entityId)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const customer = await prisma.customer.create({
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
        customerType: customerType || "individual",
        creditLimit: creditLimit ? new Decimal(creditLimit) : null,
      },
    });

    return NextResponse.json({ customer }, { status: 201 });
  } catch (error) {
    console.error("POST /api/v1/customers error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
