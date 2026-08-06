import "dotenv/config";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function loadCompanies() {
  try {
    // CASA AMELIA E.A.S.
    const existing1 = await prisma.entity.findUnique({
      where: { id: "casa-amelia-1" },
    });

    const caseAmelia =
      existing1 ||
      (await prisma.entity.create({
        data: {
          id: "casa-amelia-1",
          name: "Casa Amelia EAS",
          type: "LEGAL_ENTITY",
          taxId: "80154598-6",
          jurisdiction: "Paraguay",
          baseCurrency: "PYG",
          address:
            "Calle Nuestra Sra del Carmen esq. San Martín, Nº 1321, Oficina, Asunción",
          phone: "(0972)590909",
          email: "casaaameliapyy@gmail.com",
          colorToken: "cat-2",
          status: "active",
        },
      }));

    // AXENTIA E.A.S. UNIPERSONAL
    const existing2 = await prisma.entity.findUnique({
      where: { id: "axentia-1" },
    });

    const axentia =
      existing2 ||
      (await prisma.entity.create({
        data: {
          id: "axentia-1",
          name: "Axentia EAS",
          type: "LEGAL_ENTITY",
          taxId: "80175241-8",
          jurisdiction: "Paraguay",
          baseCurrency: "PYG",
          address:
            "Villa Amelia Aregua esq. Ciudad Universitaria, a una cuadra de la Avenida MCAL. López, San Lorenzo",
          phone: "(0972)590909",
          email: "ronaldpy@gmail.com",
          colorToken: "cat-1",
          status: "active",
        },
      }));

    console.log("✓ Casa Amelia EAS:", caseAmelia.id);
    console.log("✓ Axentia EAS:", axentia.id);
    console.log("Companies loaded successfully");
  } catch (error) {
    console.error("Error loading companies:", error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

loadCompanies();
