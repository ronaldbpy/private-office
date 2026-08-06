import { prisma } from "@/lib/prisma";
import { getUserAccess, accessibleEntityIds } from "@/lib/access";
import { getAuthUserId } from "@/lib/api-auth";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const userId = await getAuthUserId();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const access = await getUserAccess(userId);
    const entityIds = accessibleEntityIds(access);

    if (entityIds.length === 0) {
      return NextResponse.json({ tasks: [] });
    }

    // Filtrar tasks de proyectos cuya entidad es accesible
    const tasks = await prisma.task.findMany({
      where: {
        project: {
          entityId: { in: entityIds },
        },
      },
      include: {
        project: {
          select: { id: true, title: true, status: true },
        },
        comments: {
          orderBy: { createdAt: "desc" },
          take: 5,
        },
      },
      orderBy: { dueDate: "asc" },
    });

    return NextResponse.json({ tasks });
  } catch (error) {
    console.error("GET /api/v1/tasks error:", error);
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
    const { projectId, title, description, priority, dueDate } = body;

    if (!projectId || !title) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 422 }
      );
    }

    // Verificar que el proyecto pertenece a entidad accesible
    const project = await prisma.project.findUnique({
      where: { id: projectId },
    });

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    const access = await getUserAccess(userId);
    const entityIds = accessibleEntityIds(access);

    if (!entityIds.includes(project.entityId)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const task = await prisma.task.create({
      data: {
        projectId,
        title,
        description: description || null,
        priority: priority || "medium",
        dueDate: dueDate ? new Date(dueDate) : null,
        createdBy: userId,
      },
      include: {
        project: { select: { id: true, title: true } },
        comments: true,
      },
    });

    return NextResponse.json({ task }, { status: 201 });
  } catch (error) {
    console.error("POST /api/v1/tasks error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
