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
      return NextResponse.json({ holdings: [] });
    }

    const holdings = await prisma.ownershipInterest.findMany({
      where: {
        OR: [
          { ownerId: { in: entityIds } },
          { subjectEntityId: { in: entityIds } },
        ],
      },
      include: {
        owner: { select: { id: true, name: true } },
        ownerParty: { select: { id: true, fullName: true } },
        subjectEntity: { select: { id: true, name: true } },
      },
      orderBy: { effectiveFrom: "desc" },
    });

    const formatted = holdings.map((h) => ({
      id: h.id,
      ownerId: h.ownerId,
      ownerName: h.owner?.name || h.ownerParty?.fullName || null,
      subjectEntityId: h.subjectEntityId,
      subjectEntityName: h.subjectEntity.name,
      percentage: h.percentage ? parseFloat(h.percentage.toString()) : null,
      interestType: h.interestType,
      effectiveFrom: h.effectiveFrom.toISOString(),
      effectiveTo: h.effectiveTo?.toISOString() || null,
      verificationState: h.verificationState,
    }));

    return NextResponse.json({ holdings: formatted });
  } catch (error) {
    console.error("GET /api/v1/holdings error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
