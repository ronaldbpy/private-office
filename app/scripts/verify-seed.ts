import "dotenv/config";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function verifySeed() {
  try {
    console.log("📊 VERIFICACIÓN DE DATOS CARGADOS\n");
    console.log("=" .repeat(80));

    // Entidades
    console.log("\n1️⃣  ENTIDADES CARGADAS:");
    console.log("-".repeat(80));
    const entities = await prisma.entity.findMany({
      where: {
        companyType: {
          in: ["PERSONAL_SERVICE", "EVENT_SERVICES", "CONSULTING"],
        },
      },
      orderBy: { createdAt: "asc" },
    });

    entities.forEach((e, i) => {
      console.log(`\n${i + 1}. ${e.name}`);
      console.log(`   ID: ${e.id}`);
      console.log(`   RUC: ${e.taxId}`);
      console.log(`   Tipo: ${e.companyType}`);
      console.log(`   Estado: ${e.status}`);
      console.log(`   Dirección: ${e.address}`);
      console.log(`   Email: ${e.email}`);
    });

    // Clientes
    console.log("\n\n2️⃣  CLIENTES CARGADOS:");
    console.log("-".repeat(80));
    const customers = await prisma.customer.findMany({
      where: {
        entity: {
          companyType: {
            in: ["PERSONAL_SERVICE", "EVENT_SERVICES", "CONSULTING"],
          },
        },
      },
      include: { entity: true },
      orderBy: { createdAt: "asc" },
    });

    const customersByEntity = customers.reduce(
      (acc: any, c) => {
        if (!acc[c.entity.name]) acc[c.entity.name] = [];
        acc[c.entity.name].push(c);
        return acc;
      },
      {}
    );

    Object.entries(customersByEntity).forEach(([entityName, customers_]: any) => {
      console.log(`\n📌 ${entityName}:`);
      customers_.forEach((c: any, i: number) => {
        console.log(`   ${i + 1}. ${c.fullName} (${c.businessName})`);
        console.log(`      Email: ${c.email} | Teléfono: ${c.phone}`);
        console.log(`      Estado: ${c.status}`);
      });
    });

    // Productos/Servicios
    console.log("\n\n3️⃣  PRODUCTOS/SERVICIOS CARGADOS:");
    console.log("-".repeat(80));
    const products = await prisma.product.findMany({
      where: {
        entity: {
          companyType: {
            in: ["PERSONAL_SERVICE", "EVENT_SERVICES", "CONSULTING"],
          },
        },
      },
      include: { entity: true },
      orderBy: { createdAt: "asc" },
    });

    const productsByEntity = products.reduce(
      (acc: any, p) => {
        if (!acc[p.entity.name]) acc[p.entity.name] = [];
        acc[p.entity.name].push(p);
        return acc;
      },
      {}
    );

    Object.entries(productsByEntity).forEach(([entityName, products_]: any) => {
      console.log(`\n📌 ${entityName}:`);
      products_.forEach((p: any, i: number) => {
        console.log(`   ${i + 1}. [${p.code}] ${p.name}`);
        console.log(`      Descripción: ${p.description}`);
        console.log(`      Tipo: ${p.productType} | Precio: ${p.unitPrice} ${p.currency}`);
        console.log(`      Estado: ${p.status}`);
      });
    });

    // Resumen
    console.log("\n\n" + "=" .repeat(80));
    console.log("📋 RESUMEN FINAL:");
    console.log("=" .repeat(80));
    console.log(`✅ Entidades: ${entities.length}`);
    console.log(`✅ Clientes: ${customers.length}`);
    console.log(`✅ Productos/Servicios: ${products.length}`);
    console.log(`\n✨ Total de registros cargados: ${entities.length + customers.length + products.length}`);
  } catch (error) {
    console.error("❌ Error verificando datos:", error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

verifySeed();
