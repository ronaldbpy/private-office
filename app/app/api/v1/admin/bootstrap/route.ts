import { currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const user = await currentUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    console.log(`[Bootstrap] Starting for user ${user.id}`);

    // Seed entidades
    const entities = [];

    const rucPersonal = await prisma.entity.upsert({
      where: { id: "ruc-personal-1" },
      update: {},
      create: {
        id: "ruc-personal-1",
        name: "RUC Personal",
        type: "LEGAL_ENTITY",
        companyType: "PERSONAL_SERVICE",
        taxId: "3676596-1",
        jurisdiction: "Paraguay",
        baseCurrency: "PYG",
        address: "Asunción, Paraguay",
        phone: "+595 961 234567",
        email: "ruc.personal@example.com",
        colorToken: "cat-3",
        status: "active",
      },
    });
    entities.push(rucPersonal);
    console.log(`[Bootstrap] Created entity: ${rucPersonal.id}`);

    const caseAmelia = await prisma.entity.upsert({
      where: { id: "casa-amelia-1" },
      update: {},
      create: {
        id: "casa-amelia-1",
        name: "Casa Amelia EAS",
        type: "LEGAL_ENTITY",
        companyType: "EVENT_SERVICES",
        taxId: "80154598-6",
        jurisdiction: "Paraguay",
        baseCurrency: "PYG",
        address: "Calle Nuestra Sra del Carmen esq. San Martín, Nº 1321, Asunción",
        phone: "(0972)590909",
        email: "casaaameliapyy@gmail.com",
        colorToken: "cat-2",
        status: "active",
      },
    });
    entities.push(caseAmelia);
    console.log(`[Bootstrap] Created entity: ${caseAmelia.id}`);

    const axentia = await prisma.entity.upsert({
      where: { id: "axentia-1" },
      update: {},
      create: {
        id: "axentia-1",
        name: "Axentia EAS",
        type: "LEGAL_ENTITY",
        companyType: "CONSULTING",
        taxId: "80175241-8",
        jurisdiction: "Paraguay",
        baseCurrency: "PYG",
        address: "Villa Amelia Aregua, San Lorenzo",
        phone: "(0972)590909",
        email: "ronaldpy@gmail.com",
        colorToken: "cat-1",
        status: "active",
      },
    });
    entities.push(axentia);
    console.log(`[Bootstrap] Created entity: ${axentia.id}`);

    // Crear UserAccess OWNER para usuario actual
    const accesses = [];
    for (const entity of entities) {
      const access = await prisma.userAccess.upsert({
        where: {
          clerkUserId_entityId: {
            clerkUserId: user.id,
            entityId: entity.id
          }
        },
        update: {},
        create: {
          clerkUserId: user.id,
          entityId: entity.id,
          role: "OWNER",
          cascadesToSubsidiaries: true,
        },
      });
      accesses.push(access);
      console.log(`[Bootstrap] Created access for user ${user.id} to entity ${entity.id}`);
    }

    console.log(`[Bootstrap] Completed successfully`);
    return NextResponse.json({
      success: true,
      entities: entities.map(e => ({ id: e.id, name: e.name })),
      accesses: accesses.length,
      message: `✓ Bootstrap completado. Usuario tiene acceso OWNER a ${entities.length} entidades.`,
    });
  } catch (error) {
    console.error("[Bootstrap] Error:", error);
    return NextResponse.json(
      {
        error: "Bootstrap failed",
        details: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    );
  }
}
