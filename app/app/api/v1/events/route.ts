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

    const events = await prisma.event.findMany({
      where: { entityId: { in: entityIds } },
      orderBy: { startDate: "asc" },
    });

    return NextResponse.json({ events });
  } catch (error) {
    console.error("GET /api/v1/events error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const userId = await getAuthUserId();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    const { entityId, title, description, eventType, startDate, endDate, location, attendees } = body;

    if (!entityId || !title || !startDate) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 422 });
    }

    const access = await getUserAccess(userId);
    const entityIds = accessibleEntityIds(access);

    if (!entityIds.includes(entityId)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const event = await prisma.event.create({
      data: {
        entityId,
        title,
        description,
        eventType: eventType || "event",
        startDate: new Date(startDate),
        endDate: endDate ? new Date(endDate) : null,
        location,
        attendees: attendees ? JSON.stringify(attendees) : null,
        createdBy: userId,
      },
    });

    return NextResponse.json({ event }, { status: 201 });
  } catch (error) {
    console.error("POST /api/v1/events error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
