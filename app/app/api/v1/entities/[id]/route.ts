import { prisma } from "@/lib/prisma";
import { getUserAccess, accessibleEntityIds } from "@/lib/access";
import { getAuthUserId } from "@/lib/api-auth";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const userId = await getAuthUserId();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const access = await getUserAccess(userId);
    const entityIds = accessibleEntityIds(access);

    // Verificar que el usuario tiene acceso a esta entidad
    if (!entityIds.includes(params.id)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const entity = await prisma.entity.findUnique({
      where: { id: params.id },
      include: {
        ownedInterests: {
          include: { owner: true, ownerParty: true, subjectEntity: true },
        },
        interestsHeldBy: {
          include: { owner: true, ownerParty: true },
        },
        partyLinks: {
          include: { party: true },
        },
        accounts: {
          include: {
            balances: {
              orderBy: { createdAt: "desc" },
              take: 1,
            },
          },
        },
      },
    });

    if (!entity) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    return NextResponse.json({ entity });
  } catch (error) {
    console.error(`GET /api/v1/entities/${params.id} error:`, error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
