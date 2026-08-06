import { prisma } from "@/lib/prisma";

export async function createTimelineEvent(
  entityId: string | null,
  eventType: string,
  description: string,
  changedBy: string,
  changes?: Record<string, any>
) {
  return prisma.timelineEvent.create({
    data: {
      entityId,
      eventType,
      description,
      changedBy,
      changes: changes ? JSON.stringify(changes) : null,
    },
  });
}
