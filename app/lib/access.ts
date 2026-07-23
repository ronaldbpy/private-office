// Capa de autorización (FS-005 / SEC-001).
// Nunca se confía en el rol que venga del cliente: siempre se resuelve
// server-side contra la tabla user_access.

import { prisma } from "@/lib/prisma";

export type AccessEntry = {
  entityId: string;
  entityName: string;
  role: "OWNER" | "CONTADOR" | "ASISTENTE" | "GERENTE";
};

export async function getUserAccess(clerkUserId: string): Promise<AccessEntry[]> {
  const rows = await prisma.userAccess.findMany({
    where: { clerkUserId },
    include: { entity: true },
  });

  return rows.map((r) => ({
    entityId: r.entityId,
    entityName: r.entity.name,
    role: r.role,
  }));
}

export function accessibleEntityIds(access: AccessEntry[]): string[] {
  return access.map((a) => a.entityId);
}
