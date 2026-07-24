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
    update: { taxId: "3676596-1" },
    create: {
      id: "ruc-personal-ronald",
      name: "RUC Personal — Ronald Alejandro Barrios Duarte",
      type: "PERSONAL_PROFILE",
      taxId: "3676596-1",
      jurisdiction: "Paraguay",
      baseCurrency: "PYG",
    },
  });

  // -----------------------------------------------------------------------
  // 1.b) Grupo constructor por crear (sesión 2026-07-24) — 6 empresas nuevas,
  // 50% Axentia EAS / 50% Alexis de Kermenguy. Ninguna tiene RUC todavía;
  // se registran con status "pending_incorporation" y datos de contacto
  // genéricos/placeholder hasta que exista constitución legal real.
  // Decisión de estructura: ver ADR-006 (Axentia como holding operativa
  // del grupo constructor, no participación personal directa de Ronald).
  // -----------------------------------------------------------------------
  const GENERIC_ADDRESS = "Asunción, Paraguay (dirección pendiente de confirmar)";
  const GENERIC_PHONE = "+595 21 000 0000";

  const constructionCosData = [
    {
      id: "adkb-arquitectura",
      name: "+adkb. Arquitectura & Compañía",
      taxId: "90000001-1",
      email: "contacto@adkb.com.py",
    },
    {
      id: "espace-constructora",
      name: "Espace Constructora",
      taxId: "90000002-2",
      email: "contacto@espace.com.py",
    },
    {
      id: "3-1-albanileria-hormigon",
      name: "3:1. Albañilería & Hormigón",
      taxId: "90000003-3",
      email: "contacto@3-1.com.py",
    },
    {
      id: "luz-agua-instalaciones",
      name: "Luz & Agua Instalaciones",
      taxId: "90000004-4",
      email: "contacto@luzyagua.com.py",
    },
    {
      id: "moopa-clean",
      name: "Moopa Clean",
      taxId: "90000005-5",
      email: "contacto@moopaclean.com.py",
    },
    {
      id: "arte-pantone",
      name: "arte&pantone",
      taxId: "90000006-6",
      email: "contacto@artepantone.com.py",
    },
  ];

  const constructionCos = [];
  for (const co of constructionCosData) {
    const created = await prisma.entity.upsert({
      where: { id: co.id },
      update: {},
      create: {
        id: co.id,
        name: co.name,
        type: "LEGAL_ENTITY",
        taxId: co.taxId, // placeholder genérico — reemplazar cuando la SET emita el RUC real
        jurisdiction: "Paraguay",
        baseCurrency: "PYG",
        address: GENERIC_ADDRESS,
        phone: GENERIC_PHONE,
        email: co.email, // placeholder genérico
        status: "pending_incorporation",
      },
    });
    constructionCos.push(created);
  }

  console.log(
    "✔ 6 empresas del grupo constructor creadas (pending_incorporation, datos placeholder):",
    constructionCos.map((c) => c.name).join(", "),
  );

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

  // ---------------------------------------------------------------------
  // 4) Acceso del Owner (FS-005) — Ronald tiene rol OWNER en las 3 entidades
  // originales + las 6 empresas del grupo constructor. Ronald es el
  // inversionista/owner en todas, aunque en las 6 nuevas la propiedad
  // formal la sostenga Axentia EAS (ver ADR-006) — acceso operativo al
  // sistema es independiente de quién figura como titular societario.
  // ---------------------------------------------------------------------
  const OWNER_CLERK_ID = "user_3GvDXLehFYaF4fb0qQpnD73FUEM";

  for (const entity of [axentia, amelia, personal, ...constructionCos]) {
    const access = await prisma.userAccess.upsert({
      where: {
        clerkUserId_entityId: {
          clerkUserId: OWNER_CLERK_ID,
          entityId: entity.id,
        },
      },
      update: {},
      create: {
        clerkUserId: OWNER_CLERK_ID,
        entityId: entity.id,
        role: "OWNER",
      },
    });

    // Registro de auditoria del alta de acceso (regla FS-005 / DM-002)
    const alreadyLogged = await prisma.accessChangeLog.findFirst({
      where: { userAccessId: access.id, changeType: "created" },
    });
    if (!alreadyLogged) {
      await prisma.accessChangeLog.create({
        data: {
          userAccessId: access.id,
          changedBy: OWNER_CLERK_ID,
          changeType: "created",
          afterState: `role=OWNER, entity=${entity.name}`,
        },
      });
    }
  }

  console.log("✔ Acceso OWNER asignado a Ronald en las 3 entidades originales + las 6 empresas del grupo constructor.");

  // ---------------------------------------------------------------------
  // 5) Ownership (FS-003) — solo se registran hechos YA consumados.
  // El 50% restante de Amelia está negociado pero NO cerrado documentalmente
  // — por regla constitucional (MD-000 #1: no inventar hechos) NO se carga
  // acá como participación; queda anotado como nota abierta hasta el cierre.
  // ---------------------------------------------------------------------
  await prisma.ownershipInterest.upsert({
    where: { id: "ownership-ronald-axentia" },
    update: {},
    create: {
      id: "ownership-ronald-axentia",
      ownerId: personal.id,
      subjectEntityId: axentia.id,
      interestType: "equity",
      percentage: 100.0,
      effectiveFrom: axentia.createdAt,
      verificationState: "verified",
      approvedBy: "owner",
    },
  });

  await prisma.ownershipInterest.upsert({
    where: { id: "ownership-ronald-amelia" },
    update: {},
    create: {
      id: "ownership-ronald-amelia",
      ownerId: personal.id,
      subjectEntityId: amelia.id,
      interestType: "equity",
      percentage: 50.0,
      effectiveFrom: amelia.createdAt,
      verificationState: "verified",
      approvedBy: "owner",
      notes:
        "Negociado un 50% adicional (llegar\u00eda a 100%). Pendiente cierre documental — no se registra como participación hasta confirmarse formalmente.",
    },
  });

  console.log("✔ Ownership cargado: 100% Axentia, 50% Amelia (el otro 50% queda como nota abierta, sin cerrar).");

  // ---------------------------------------------------------------------
  // 6) Parties (FS-004) — contactos externos, sin acceso al sistema
  // ---------------------------------------------------------------------
  const alexis = await prisma.party.upsert({
    where: { id: "party-alexis-de-kermenguy" },
    update: { relationshipType: "EXTERNAL_PARTNER" }, // actualizado 2026-07-24: pasa de proveedor a socio operativo 50% en 6 empresas
    create: {
      id: "party-alexis-de-kermenguy",
      fullName: "Alexis De Kermenguy",
      taxId: "4416020-8",
      relationshipType: "EXTERNAL_PARTNER",
    },
  });

  await prisma.partyEntityLink.upsert({
    where: {
      partyId_entityId: { partyId: alexis.id, entityId: axentia.id },
    },
    update: {},
    create: { partyId: alexis.id, entityId: axentia.id },
  });

  console.log("✔ Party cargado: Alexis De Kermenguy (socio externo 50%, ex-proveedor de Axentia EAS).");

  // ---------------------------------------------------------------------
  // 7) Ownership del grupo constructor (sesión 2026-07-24) — FS-003.
  // 50% Axentia EAS (Entity) + 50% Alexis de Kermenguy (Party) en cada una
  // de las 6 empresas. verificationState = "unverified" porque ninguna
  // tiene todavía constitución legal ni RUC real (regla MD-000 #3: la
  // decisión de split ya está tomada por el owner, pero el hecho societario
  // formal aún no existe — se marca como no verificado, no como inventado).
  // ---------------------------------------------------------------------
  const STRUCTURE_DECISION_DATE = new Date("2026-07-24");

  for (const co of constructionCos) {
    await prisma.partyEntityLink.upsert({
      where: { partyId_entityId: { partyId: alexis.id, entityId: co.id } },
      update: {},
      create: { partyId: alexis.id, entityId: co.id },
    });

    await prisma.ownershipInterest.upsert({
      where: { id: `ownership-axentia-${co.id}` },
      update: {},
      create: {
        id: `ownership-axentia-${co.id}`,
        ownerId: axentia.id,
        subjectEntityId: co.id,
        interestType: "equity",
        percentage: 50.0,
        effectiveFrom: STRUCTURE_DECISION_DATE,
        verificationState: "unverified",
        notes:
          `Estructura acordada por el owner el 2026-07-24: Axentia EAS 50% / Alexis de Kermenguy 50% en ${co.name}. ` +
          "Pendiente constitución legal (EAS) y RUC ante la SET. Pasa a 'verified' cuando se firme el acta constitutiva.",
      },
    });

    await prisma.ownershipInterest.upsert({
      where: { id: `ownership-alexis-${co.id}` },
      update: {},
      create: {
        id: `ownership-alexis-${co.id}`,
        ownerPartyId: alexis.id,
        subjectEntityId: co.id,
        interestType: "equity",
        percentage: 50.0,
        effectiveFrom: STRUCTURE_DECISION_DATE,
        verificationState: "unverified",
        notes:
          `Estructura acordada por el owner el 2026-07-24: Alexis de Kermenguy 50% / Axentia EAS 50% en ${co.name}. ` +
          "Pendiente constitución legal (EAS) y RUC ante la SET. Pasa a 'verified' cuando se firme el acta constitutiva.",
      },
    });
  }

  console.log(
    "✔ Ownership 50/50 (Axentia / Alexis) cargado para las 6 empresas del grupo constructor (unverified, pendiente constitución legal).",
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
