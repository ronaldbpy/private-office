import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const OWNER_CLERK_ID = "user_3GvDXLehFYaF4fb0qQpnD73FUEM";

async function main() {
  const access = await prisma.userAccess.findMany({
    where: { clerkUserId: OWNER_CLERK_ID },
    include: { entity: true },
  });
  const entityIds = access.map((a) => a.entityId);
  console.log("entityIds:", entityIds.length, entityIds);

  const ownershipInterests = await prisma.ownershipInterest.findMany({
    where: { subjectEntityId: { in: entityIds } },
    include: { owner: true, ownerParty: true, subjectEntity: true },
    orderBy: { subjectEntity: { name: "asc" } },
  });
  console.log("ownershipInterests OK:", ownershipInterests.length);

  const partyLinks = await prisma.partyEntityLink.findMany({
    where: { entityId: { in: entityIds } },
    include: { party: true, entity: true },
    orderBy: { party: { fullName: "asc" } },
  });
  console.log("partyLinks OK:", partyLinks.length);

  const obligations = await prisma.obligation.findMany({
    where: { entityId: { in: entityIds } },
    include: { entity: true, dueRule: true },
    orderBy: [{ entity: { name: "asc" } }, { code: "asc" }],
  });
  console.log("obligations OK:", obligations.length);
}
main()
  .catch((e) => {
    console.error("ERROR REAL:", e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
