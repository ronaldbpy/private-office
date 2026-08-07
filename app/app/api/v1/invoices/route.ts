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

    const invoices = await prisma.invoice.findMany({
      where: { entityId: { in: entityIds } },
      include: { customer: true, items: { include: { product: true } }, payments: true },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ invoices });
  } catch (error) {
    console.error("GET /api/v1/invoices error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const userId = await getAuthUserId();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    const { entityId, customerId, invoiceNumber, invoiceType, subtotal, taxAmount, total, issueDate, dueDate, items } = body;

    if (!entityId || !invoiceNumber || !invoiceType) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 422 });
    }

    const access = await getUserAccess(userId);
    const entityIds = accessibleEntityIds(access);

    if (!entityIds.includes(entityId)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const invoice = await prisma.invoice.create({
      data: {
        entityId,
        customerId: customerId || null,
        invoiceNumber,
        invoiceType,
        subtotal: typeof subtotal === "string" ? parseFloat(subtotal) : subtotal,
        taxAmount: typeof taxAmount === "string" ? parseFloat(taxAmount) : taxAmount,
        total: typeof total === "string" ? parseFloat(total) : total,
        issueDate: new Date(issueDate),
        dueDate: dueDate ? new Date(dueDate) : null,
        createdBy: userId,
        items: {
          create: items?.map((item: any) => ({
            productId: item.productId,
            quantity: typeof item.quantity === "string" ? parseFloat(item.quantity) : item.quantity,
            unitPrice: typeof item.unitPrice === "string" ? parseFloat(item.unitPrice) : item.unitPrice,
            taxRate: typeof item.taxRate === "string" ? parseFloat(item.taxRate) : item.taxRate,
            total: typeof item.total === "string" ? parseFloat(item.total) : item.total,
          })) || [],
        },
      },
      include: { items: true, customer: true },
    });

    return NextResponse.json({ invoice }, { status: 201 });
  } catch (error) {
    console.error("POST /api/v1/invoices error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
