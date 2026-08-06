import { prisma } from "@/lib/prisma";
import { getUserAccess, accessibleEntityIds } from "@/lib/access";
import { getAuthUserId } from "@/lib/api-auth";
import { NextResponse } from "next/server";

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const userId = await getAuthUserId();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const access = await getUserAccess(userId);
    const entityIds = accessibleEntityIds(access);

    const task = await prisma.task.findUnique({
      where: { id },
      include: { project: { select: { entityId: true } } },
    });

    if (!task) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    if (!entityIds.includes(task.project.entityId)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    await prisma.task.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE /api/v1/tasks/[id] error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
