import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // Crear perfil personal de Ronald (PERSONAL_PROFILE)
  const ronaldProfile = await prisma.entity.create({
    data: {
      name: "RUC Personal — Ronald Alejandro Barrios Duarte",
      type: "PERSONAL_PROFILE",
      taxId: "PLACEHOLDER_RUC_PERSONAL",
      jurisdiction: "Paraguay",
      baseCurrency: "PYG",
      status: "active",
      colorToken: "cat-1",
    },
  });
  console.log("✓ Created Ronald's personal profile");

  // Crear Axentia EAS (holding)
  const axentia = await prisma.entity.create({
    data: {
      name: "Axentia EAS",
      type: "LEGAL_ENTITY",
      taxId: "PLACEHOLDER_RUC_AXENTIA",
      jurisdiction: "Paraguay",
      baseCurrency: "PYG",
      status: "active",
      colorToken: "cat-2",
    },
  });
  console.log("✓ Created Axentia EAS entity");

  // Crear Casa Amelia EAS (subsidiaria de Axentia)
  const casaAmelia = await prisma.entity.create({
    data: {
      name: "Casa Amelia EAS",
      type: "LEGAL_ENTITY",
      taxId: "PLACEHOLDER_RUC_CASA_AMELIA",
      jurisdiction: "Paraguay",
      baseCurrency: "PYG",
      status: "active",
      colorToken: "cat-3",
    },
  });
  console.log("✓ Created Casa Amelia EAS entity");

  // Ronald es 100% dueño de Axentia (Owner)
  await prisma.ownershipInterest.create({
    data: {
      ownerId: ronaldProfile.id,
      subjectEntityId: axentia.id,
      interestType: "equity",
      percentage: 100,
      effectiveFrom: new Date("2026-01-01"),
      verificationState: "verified",
      approvedBy: "system",
    },
  });
  console.log("✓ Created Ronald ownership of Axentia (100%)");

  // Crear acceso de usuario para Ronald a Axentia (Owner role con cascada)
  // clerkUserId obtenido desde Clerk API
  const ronaldClerkId = "user_3GvDXLehFYaF4fb0qQpnD73FUEM";
  await prisma.userAccess.create({
    data: {
      clerkUserId: ronaldClerkId,
      role: "OWNER",
      entityId: axentia.id,
      cascadesToSubsidiaries: true,
    },
  });
  console.log("✓ Created Ronald's access to Axentia (OWNER, cascading)");

  // Axentia es 100% dueño de Casa Amelia (cascada)
  await prisma.ownershipInterest.create({
    data: {
      ownerId: axentia.id,
      subjectEntityId: casaAmelia.id,
      interestType: "equity",
      percentage: 100,
      effectiveFrom: new Date("2026-01-01"),
      verificationState: "verified",
      approvedBy: "system",
    },
  });
  console.log("✓ Created Axentia ownership of Casa Amelia (100%)");

  // Crear cuenta bancaria para Axentia
  const axentiaAccount = await prisma.account.create({
    data: {
      entityId: axentia.id,
      accountNumber: "2501-****-789",
      accountName: "Cuenta corriente principal",
      accountType: "checking",
      provider: "Banco Regional del Paraguay",
      currency: "PYG",
      status: "active",
    },
  });
  console.log("✓ Created Axentia bank account");

  // Crear saldo actual para Axentia
  const today = new Date();
  await prisma.accountBalance.create({
    data: {
      accountId: axentiaAccount.id,
      amount: 15750000, // PYG
      asOfDate: new Date(today.getFullYear(), today.getMonth(), today.getDate()),
      source: "manual",
      importedBy: "system",
    },
  });
  console.log("✓ Created Axentia account balance");

  // Crear transacciones de ejemplo
  await prisma.accountMovement.create({
    data: {
      accountId: axentiaAccount.id,
      description: "Transferencia entrada — pago de cliente",
      amount: 5000000,
      direction: "in",
      transactionDate: new Date("2026-08-03"),
      classification: "transfer",
    },
  });

  await prisma.accountMovement.create({
    data: {
      accountId: axentiaAccount.id,
      description: "Transferencia salida — pago a proveedor",
      amount: 2500000,
      direction: "out",
      transactionDate: new Date("2026-08-02"),
      classification: "transfer",
    },
  });

  await prisma.accountMovement.create({
    data: {
      accountId: axentiaAccount.id,
      description: "Comisión bancaria mensual",
      amount: 75000,
      direction: "out",
      transactionDate: new Date("2026-08-01"),
      classification: "fee",
    },
  });
  console.log("✓ Created sample transactions");

  console.log("\n✅ Seed completed successfully!");
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
