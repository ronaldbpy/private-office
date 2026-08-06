import { prisma } from "@/lib/prisma";
import { getAuthUserId } from "@/lib/api-auth";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const userId = await getAuthUserId();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const parties = await prisma.party.findMany({
      where: { status: "active" },
      select: {
        id: true,
        fullName: true,
        email: true,
        phone: true,
        relationshipType: true,
        status: true,
        createdAt: true,
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ parties });
  } catch (error) {
    console.error("GET /api/v1/parties error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const userId = await getAuthUserId();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { fullName, email, phone, relationshipType } = body;

    if (!fullName || !relationshipType) {
      return NextResponse.json(
        { error: "Missing required fields (fullName, relationshipType)" },
        { status: 422 }
      );
    }

    const party = await prisma.party.create({
      data: {
        fullName,
        email: email || null,
        phone: phone || null,
        relationshipType,
        status: "active",
      },
    });

    return NextResponse.json({ party }, { status: 201 });
  } catch (error) {
    console.error("POST /api/v1/parties error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
