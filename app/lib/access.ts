// Capa de autorización (FS-005 / SEC-001).
// Nunca se confía en el rol que venga del cliente: siempre se resuelve
// server-side contra la tabla user_access.

import { prisma } from "@/lib/prisma";

export type Role =
  | "OWNER"
  | "ADMINISTRADOR_HOLDING"
  | "SOCIO_OPERATIVO"
  | "GERENTE"
  | "CONTADOR"
  | "ASISTENTE";

export type AccessEntry = {
  entityId: string;
  entityName: string;
  entityColorToken: string | null;
  role: Role;
  // true = este acceso no fue otorgado directamente sobre esta entidad,
  // sino heredado de un UserAccess con cascadesToSubsidiaries=true sobre
  // el holding que la posee (ver ADR-007). Se muestra en UI para que
  // siempre quede claro de dónde viene un permiso (SEC-001: nada implícito
  // sin ser explicable).
  cascadedFrom?: string; // nombre del holding de origen, si aplica
};

export async function getUserAccess(clerkUserId: string): Promise<AccessEntry[]> {
  const rows = await prisma.userAccess.findMany({
    where: { clerkUserId },
    include: { entity: true },
  });

  const direct: AccessEntry[] = rows.map((r) => ({
    entityId: r.entityId,
    entityName: r.entity.name,
    entityColorToken: r.entity.colorToken,
    role: r.role,
  }));

  // Resolver cascada: por cada grant marcado cascadesToSubsidiaries, sumar
  // toda entidad donde el holding figura como owner en OwnershipInterest.
  // Un solo nivel (holding -> subsidiarias directas), no recursivo todavía —
  // suficiente para la estructura actual del Grupo.
  const cascadingGrants = rows.filter((r) => r.cascadesToSubsidiaries);
  const cascaded: AccessEntry[] = [];

  for (const grant of cascadingGrants) {
    const subsidiaries = await prisma.ownershipInterest.findMany({
      where: { ownerId: grant.entityId },
      include: { subjectEntity: true },
    });

    for (const oi of subsidiaries) {
      const alreadyHasDirect = direct.some((d) => d.entityId === oi.subjectEntityId);
      const alreadyCascaded = cascaded.some((c) => c.entityId === oi.subjectEntityId);
      if (!alreadyHasDirect && !alreadyCascaded) {
        cascaded.push({
          entityId: oi.subjectEntityId,
          entityName: oi.subjectEntity.name,
          entityColorToken: oi.subjectEntity.colorToken,
          role: grant.role,
          cascadedFrom: grant.entity.name,
        });
      }
    }
  }

  return [...direct, ...cascaded];
}

export function accessibleEntityIds(access: AccessEntry[]): string[] {
  return access.map((a) => a.entityId);
}
