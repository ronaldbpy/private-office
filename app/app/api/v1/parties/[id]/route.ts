import { prisma } from "@/lib/prisma";
import { getAuthUserId } from "@/lib/api-auth";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const userId = await getAuthUserId();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const party = await prisma.party.findUnique({
      where: { id },
      include: {
        entityLinks: {
          select: {
            entity: {
              select: { id: true, name: true, colorToken: true },
            },
          },
        },
        bankingDetails: true,
      },
    });

    if (!party) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    return NextResponse.json({ party });
  } catch (error) {
    console.error("GET /api/v1/parties/[id] error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const userId = await getAuthUserId();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { fullName, email, phone, status } = body;

    const party = await prisma.party.update({
      where: { id },
      data: {
        ...(fullName && { fullName }),
        ...(email !== undefined && { email }),
        ...(phone !== undefined && { phone }),
        ...(status && { status }),
      },
    });

    return NextResponse.json({ party });
  } catch (error) {
    console.error("PATCH /api/v1/parties/[id] error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
