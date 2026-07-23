// Seed inicial — carga los datos reales definidos en FS-003, FS-005 y FS-017
// durante la sesión de trabajo del 2026-07-23.
// Ejecutar con: npx prisma db seed

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // ---------------------------------------------------------------------
  // 1) Entidades (FS-003)
  // ---------------------------------------------------------------------
  const axentia = await prisma.entity.upsert({
    where: { id: "axentia-eas" },
    update: {},
    create: {
      id: "axentia-eas",
      name: "Axentia EAS",
      type: "LEGAL_ENTITY",
      jurisdiction: "Paraguay",
      baseCurrency: "PYG",
    },
  });

  const amelia = await prisma.entity.upsert({
    where: { id: "casa-amelia-eas" },
    update: {},
    create: {
      id: "casa-amelia-eas",
      name: "Casa Amelia EAS",
      type: "LEGAL_ENTITY",
      jurisdiction: "Paraguay",
      baseCurrency: "PYG",
    },
  });

  const personal = await prisma.entity.upsert({
    where: { id: "ruc-personal-ronald" },
    update: {},
    create: {
      id: "ruc-personal-ronald",
      name: "RUC Personal — Ronald Alejandro Barrios Duarte",
      type: "PERSONAL_PROFILE",
      jurisdiction: "Paraguay",
      baseCurrency: "PYG",
    },
  });

  console.log("✔ Entidades creadas:", axentia.name, amelia.name, personal.name);

  // ---------------------------------------------------------------------
  // 2) Obligaciones (FS-017) — Axentia y Casa Amelia comparten el mismo set
  // ---------------------------------------------------------------------
  const sharedObligations = [
    { code: "211", name: "IVA General", activeSince: new Date("2026-07-22") },
    { code: "954", name: "DJI IDU", activeSince: new Date("2026-07-22") },
    { code: "700", name: "IRE General", activeSince: new Date("2026-07-22") },
    { code: "726", name: "RET IDU", activeSince: new Date("2026-07-22") },
  ];

  for (const entity of [axentia, amelia]) {
    for (const ob of sharedObligations) {
      await prisma.obligation.upsert({
        where: { entityId_code: { entityId: entity.id, code: ob.code } },
        update: {},
        create: {
          entityId: entity.id,
          code: ob.code,
          name: ob.name,
          activeSince: ob.activeSince,
        },
      });
    }
  }

  // Obligaciones del RUC personal
  const personalObligations = [
    { code: "211", name: "IVA General", activeSince: new Date("2022-07-11") },
    { code: "700", name: "IRE General", activeSince: new Date("2020-01-01") },
    { code: "735", name: "Anticipo IRE", activeSince: new Date("2020-01-01") },
    { code: "948", name: "Estados Financieros", activeSince: new Date("2014-01-01") },
    { code: "954", name: "DJI IDU", activeSince: new Date("2019-12-31") },
    {
      code: "955",
      name: "Régimen Mensual de Comprobantes",
      activeSince: new Date("2022-07-11"),
    },
  ];

  for (const ob of personalObligations) {
    await prisma.obligation.upsert({
      where: { entityId_code: { entityId: personal.id, code: ob.code } },
      update: {},
      create: {
        entityId: personal.id,
        code: ob.code,
        name: ob.name,
        activeSince: ob.activeSince,
      },
    });
  }

  console.log("✔ Obligaciones cargadas para las 3 entidades.");

  // ---------------------------------------------------------------------
  // 3) Reglas de vencimiento confirmadas (FS-017)
  // ---------------------------------------------------------------------
  const allObligations = await prisma.obligation.findMany();

  for (const ob of allObligations) {
    if (ob.code === "211") {
      await prisma.obligationDueRule.upsert({
        where: { obligationId: ob.id },
        update: {},
        create: {
          obligationId: ob.id,
          ruleText: "Día 8 de cada mes (regla uniforme para todas las entidades)",
          confirmed: true,
          confirmedBy: "owner",
        },
      });
    } else if (ob.code === "700") {
      await prisma.obligationDueRule.upsert({
        where: { obligationId: ob.id },
        update: {},
        create: {
          obligationId: ob.id,
          ruleText: "8 de abril, anual",
          confirmed: true,
          confirmedBy: "owner",
        },
      });
    }
    // El resto (954, 726, 735, 948, 955) queda sin ObligationDueRule =
    // "vencimiento sin confirmar", tal como exige FS-017 / AI-001.
  }

  console.log("✔ Reglas de vencimiento confirmadas (IVA y IRE) cargadas.");
  console.log("");
  console.log(
    "Nota: las obligaciones 954, 726, 735, 948 y 955 quedan sin regla de vencimiento",
  );
  console.log(
    "hasta que el contador confirme su periodicidad (regla FS-017 / AI-001).",
  );
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
