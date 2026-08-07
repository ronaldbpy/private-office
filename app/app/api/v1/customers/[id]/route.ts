import { prisma } from "@/lib/prisma";
import { getUserAccess, accessibleEntityIds } from "@/lib/access";
import { getAuthUserId } from "@/lib/api-auth";
import { NextResponse } from "next/server";

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  let id = "";
  try {
    const paramData = await params;
    id = paramData.id;
    const userId = await getAuthUserId();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const customer = await prisma.customer.findUnique({
      where: { id },
      include: { entity: true, invoices: true, quotes: true },
    });

    if (!customer) return NextResponse.json({ error: "Not found" }, { status: 404 });

    const access = await getUserAccess(userId);
    const entityIds = accessibleEntityIds(access);

    if (!entityIds.includes(customer.entityId)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    return NextResponse.json({ customer });
  } catch (error) {
    console.error(`GET /api/v1/customers/${id} error:`, error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  let id = "";
  try {
    const paramData = await params;
    id = paramData.id;
    const userId = await getAuthUserId();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const customer = await prisma.customer.findUnique({ where: { id } });
    if (!customer) return NextResponse.json({ error: "Not found" }, { status: 404 });

    const access = await getUserAccess(userId);
    const entityIds = accessibleEntityIds(access);

    if (!entityIds.includes(customer.entityId)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await req.json();
    const updated = await prisma.customer.update({
      where: { id },
      data: body,
    });

    return NextResponse.json({ customer: updated });
  } catch (error) {
    console.error(`PUT /api/v1/customers/${id} error:`, error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  let id = "";
  try {
    const paramData = await params;
    id = paramData.id;
    const userId = await getAuthUserId();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const customer = await prisma.customer.findUnique({ where: { id } });
    if (!customer) return NextResponse.json({ error: "Not found" }, { status: 404 });

    const access = await getUserAccess(userId);
    const entityIds = accessibleEntityIds(access);

    if (!entityIds.includes(customer.entityId)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    await prisma.customer.update({
      where: { id },
      data: { status: "archived" },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(`DELETE /api/v1/customers/${id} error:`, error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
