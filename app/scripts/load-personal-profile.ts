import "dotenv/config";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function loadPersonalProfile() {
  try {
    const existing = await prisma.entity.findUnique({
      where: { id: "ronald-personal" },
    });

    const ronald =
      existing ||
      (await prisma.entity.create({
        data: {
          id: "ronald-personal",
          name: "Ronald Alejandro Barrios Duarte",
          type: "PERSONAL_PROFILE",
          taxId: "3676596-1",
          jurisdiction: "Paraguay",
          baseCurrency: "PYG",
          phone: "(0972)590909",
          email: "ronaldpy@gmail.com",
          colorToken: "cat-6",
          status: "active",
        },
      }));

    console.log("✓ Personal profile created:", ronald.id);
    console.log("  Name:", ronald.name);
    console.log("  RUC:", ronald.taxId);
  } catch (error) {
    console.error("Error loading personal profile:", error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

loadPersonalProfile();
