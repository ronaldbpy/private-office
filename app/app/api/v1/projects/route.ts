import { prisma } from "@/lib/prisma";
import { getUserAccess, accessibleEntityIds } from "@/lib/access";
import { getAuthUserId } from "@/lib/api-auth";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const userId = await getAuthUserId();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const access = await getUserAccess(userId);
    const entityIds = accessibleEntityIds(access);

    if (entityIds.length === 0) {
      return NextResponse.json({ projects: [] });
    }

    const projects = await prisma.project.findMany({
      where: { entityId: { in: entityIds } },
      include: {
        entity: {
          select: { id: true, name: true, colorToken: true },
        },
        tasks: {
          select: {
            id: true,
            title: true,
            status: true,
            priority: true,
            dueDate: true,
            assignedTo: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ projects });
  } catch (error) {
    console.error("GET /api/v1/projects error:", error);
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
    const { entityId, title, description } = body;

    if (!entityId || !title) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 422 }
      );
    }

    const access = await getUserAccess(userId);
    const entityIds = accessibleEntityIds(access);

    if (!entityIds.includes(entityId)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const project = await prisma.project.create({
      data: {
        entityId,
        title,
        description: description || null,
        createdBy: userId,
      },
      include: {
        entity: {
          select: { id: true, name: true },
        },
      },
    });

    return NextResponse.json({ project }, { status: 201 });
  } catch (error) {
    console.error("POST /api/v1/projects error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
