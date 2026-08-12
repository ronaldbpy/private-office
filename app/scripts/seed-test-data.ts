import "dotenv/config";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function seedTestData() {
  try {
    console.log("🌱 Iniciando carga de datos de prueba...\n");

    // =========================================================================
    // 1. ENTIDADES (3 empresas)
    // =========================================================================
    console.log("📋 Creando entidades...");

    // RUC Personal (3676596-1)
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
    console.log("✓ RUC Personal:", rucPersonal.id);

    // Casa Amelia (ya debería existir del script anterior)
    const caseAmelia = await prisma.entity.upsert({
      where: { id: "casa-amelia-1" },
      update: { companyType: "EVENT_SERVICES" },
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
    console.log("✓ Casa Amelia EAS:", caseAmelia.id);

    // Axentia (ya debería existir del script anterior)
    const axentia = await prisma.entity.upsert({
      where: { id: "axentia-1" },
      update: { companyType: "CONSULTING" },
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
    console.log("✓ Axentia EAS:", axentia.id);

    // =========================================================================
    // 2. CLIENTES (2 por empresa)
    // =========================================================================
    console.log("\n👥 Creando clientes...");

    // RUC Personal - Clientes
    const rucCustomer1 = await prisma.customer.upsert({
      where: { entityId_taxId: { entityId: rucPersonal.id, taxId: "ruc-cliente-a-1" } },
      update: {},
      create: {
        fullName: "Cliente A",
        businessName: "Empresa A SRL",
        taxId: "ruc-cliente-a-1",
        phone: "+595 961 111111",
        email: "clientea@example.com",
        address: "Asunción, Paraguay",
        city: "Asunción",
        country: "Paraguay",
        customerType: "business",
        status: "active",
        entity: { connect: { id: rucPersonal.id } },
      },
    });
    console.log("✓ Cliente A (RUC Personal):", rucCustomer1.id);

    const rucCustomer2 = await prisma.customer.upsert({
      where: { entityId_taxId: { entityId: rucPersonal.id, taxId: "ruc-cliente-b-1" } },
      update: {},
      create: {
        fullName: "Cliente B",
        businessName: "Empresa B SRL",
        taxId: "ruc-cliente-b-1",
        phone: "+595 961 222222",
        email: "clienteb@example.com",
        address: "Asunción, Paraguay",
        city: "Asunción",
        country: "Paraguay",
        customerType: "business",
        status: "active",
        entity: { connect: { id: rucPersonal.id } },
      },
    });
    console.log("✓ Cliente B (RUC Personal):", rucCustomer2.id);

    // Casa Amelia - Clientes
    const ameliaCustomer1 = await prisma.customer.upsert({
      where: { entityId_taxId: { entityId: caseAmelia.id, taxId: "evento-cliente-1-1" } },
      update: {},
      create: {
        fullName: "Cliente Evento 1",
        businessName: "Empresa de Eventos A",
        taxId: "evento-cliente-1-1",
        phone: "+595 961 333333",
        email: "evento1@example.com",
        address: "Asunción, Paraguay",
        city: "Asunción",
        country: "Paraguay",
        customerType: "business",
        status: "active",
        entity: { connect: { id: caseAmelia.id } },
      },
    });
    console.log("✓ Cliente Evento 1 (Casa Amelia):", ameliaCustomer1.id);

    const ameliaCustomer2 = await prisma.customer.upsert({
      where: { entityId_taxId: { entityId: caseAmelia.id, taxId: "evento-cliente-2-1" } },
      update: {},
      create: {
        fullName: "Cliente Evento 2",
        businessName: "Empresa de Eventos B",
        taxId: "evento-cliente-2-1",
        phone: "+595 961 444444",
        email: "evento2@example.com",
        address: "Asunción, Paraguay",
        city: "Asunción",
        country: "Paraguay",
        customerType: "business",
        status: "active",
        entity: { connect: { id: caseAmelia.id } },
      },
    });
    console.log("✓ Cliente Evento 2 (Casa Amelia):", ameliaCustomer2.id);

    // Axentia - Clientes
    const axentiaCustomer1 = await prisma.customer.upsert({
      where: { entityId_taxId: { entityId: axentia.id, taxId: "axentia-cliente-cons-1" } },
      update: {},
      create: {
        fullName: "Cliente Consultoría 1",
        businessName: "Empresa de Consultoría A",
        taxId: "axentia-cliente-cons-1",
        phone: "+595 961 555555",
        email: "consult1@example.com",
        address: "Asunción, Paraguay",
        city: "Asunción",
        country: "Paraguay",
        customerType: "business",
        status: "active",
        entity: { connect: { id: axentia.id } },
      },
    });
    console.log("✓ Cliente Consultoría 1 (Axentia):", axentiaCustomer1.id);

    const axentiaCustomer2 = await prisma.customer.upsert({
      where: { entityId_taxId: { entityId: axentia.id, taxId: "axentia-cliente-cons-2" } },
      update: {},
      create: {
        fullName: "Cliente Consultoría 2",
        businessName: "Empresa de Consultoría B",
        taxId: "axentia-cliente-cons-2",
        phone: "+595 961 666666",
        email: "consult2@example.com",
        address: "Asunción, Paraguay",
        city: "Asunción",
        country: "Paraguay",
        customerType: "business",
        status: "active",
        entity: { connect: { id: axentia.id } },
      },
    });
    console.log("✓ Cliente Consultoría 2 (Axentia):", axentiaCustomer2.id);

    // =========================================================================
    // 3. PRODUCTOS/SERVICIOS (3 por empresa)
    // =========================================================================
    console.log("\n🛍️  Creando productos/servicios...");

    // RUC Personal - Servicios
    const rucProduct1 = await prisma.product.upsert({
      where: { entityId_code: { entityId: rucPersonal.id, code: "RUC-001" } },
      update: {},
      create: {
        entityId: rucPersonal.id,
        code: "RUC-001",
        name: "Facturación",
        description: "Servicio de facturación contable",
        category: "Servicios Contables",
        productType: "SERVICE",
        unitPrice: 500000,
        cost: 250000,
        currency: "PYG",
        quantity: 0,
        unit: "servicio",
        taxRate: 10,
        status: "active",
      },
    });
    console.log("✓ Facturación (RUC):", rucProduct1.id);

    const rucProduct2 = await prisma.product.upsert({
      where: { entityId_code: { entityId: rucPersonal.id, code: "RUC-002" } },
      update: {},
      create: {
        entityId: rucPersonal.id,
        code: "RUC-002",
        name: "Contabilidad",
        description: "Servicio de contabilidad anual",
        category: "Servicios Contables",
        productType: "SERVICE",
        unitPrice: 1000000,
        cost: 500000,
        currency: "PYG",
        quantity: 0,
        unit: "servicio",
        taxRate: 10,
        status: "active",
      },
    });
    console.log("✓ Contabilidad (RUC):", rucProduct2.id);

    const rucProduct3 = await prisma.product.upsert({
      where: { entityId_code: { entityId: rucPersonal.id, code: "RUC-003" } },
      update: {},
      create: {
        entityId: rucPersonal.id,
        code: "RUC-003",
        name: "Impuestos",
        description: "Asesoría sobre obligaciones tributarias",
        category: "Servicios Contables",
        productType: "SERVICE",
        unitPrice: 750000,
        cost: 375000,
        currency: "PYG",
        quantity: 0,
        unit: "servicio",
        taxRate: 10,
        status: "active",
      },
    });
    console.log("✓ Impuestos (RUC):", rucProduct3.id);

    // Casa Amelia - Servicios
    const ameliaProduct1 = await prisma.product.upsert({
      where: { entityId_code: { entityId: caseAmelia.id, code: "AME-001" } },
      update: {},
      create: {
        entityId: caseAmelia.id,
        code: "AME-001",
        name: "Alquiler Local",
        description: "Alquiler de local para eventos",
        category: "Alquileres",
        productType: "SERVICE",
        unitPrice: 2000000,
        cost: 1000000,
        currency: "PYG",
        quantity: 1,
        unit: "evento",
        taxRate: 10,
        status: "active",
      },
    });
    console.log("✓ Alquiler Local (Casa Amelia):", ameliaProduct1.id);

    const ameliaProduct2 = await prisma.product.upsert({
      where: { entityId_code: { entityId: caseAmelia.id, code: "AME-002" } },
      update: {},
      create: {
        entityId: caseAmelia.id,
        code: "AME-002",
        name: "Catering",
        description: "Servicio de catering para eventos",
        category: "Comidas",
        productType: "SERVICE",
        unitPrice: 1500000,
        cost: 750000,
        currency: "PYG",
        quantity: 0,
        unit: "persona",
        taxRate: 10,
        status: "active",
      },
    });
    console.log("✓ Catering (Casa Amelia):", ameliaProduct2.id);

    const ameliaProduct3 = await prisma.product.upsert({
      where: { entityId_code: { entityId: caseAmelia.id, code: "AME-003" } },
      update: {},
      create: {
        entityId: caseAmelia.id,
        code: "AME-003",
        name: "Sonido e Iluminación",
        description: "Servicio de sonido e iluminación profesional",
        category: "Equipamiento",
        productType: "SERVICE",
        unitPrice: 1000000,
        cost: 500000,
        currency: "PYG",
        quantity: 0,
        unit: "evento",
        taxRate: 10,
        status: "active",
      },
    });
    console.log("✓ Sonido (Casa Amelia):", ameliaProduct3.id);

    // Axentia - Servicios
    const axentiaProduct1 = await prisma.product.upsert({
      where: { entityId_code: { entityId: axentia.id, code: "AXE-001" } },
      update: {},
      create: {
        entityId: axentia.id,
        code: "AXE-001",
        name: "Consultoría General",
        description: "Consultoría empresarial general",
        category: "Consultoría",
        productType: "SERVICE",
        unitPrice: 2000000,
        cost: 1000000,
        currency: "PYG",
        quantity: 0,
        unit: "hora",
        taxRate: 10,
        status: "active",
      },
    });
    console.log("✓ Consultoría General (Axentia):", axentiaProduct1.id);

    const axentiaProduct2 = await prisma.product.upsert({
      where: { entityId_code: { entityId: axentia.id, code: "AXE-002" } },
      update: {},
      create: {
        entityId: axentia.id,
        code: "AXE-002",
        name: "Administración de Inmuebles",
        description: "Servicio de administración y gestión de propiedades",
        category: "Administración",
        productType: "SERVICE",
        unitPrice: 1500000,
        cost: 750000,
        currency: "PYG",
        quantity: 0,
        unit: "mes",
        taxRate: 10,
        status: "active",
      },
    });
    console.log("✓ Administración Inmuebles (Axentia):", axentiaProduct2.id);

    const axentiaProduct3 = await prisma.product.upsert({
      where: { entityId_code: { entityId: axentia.id, code: "AXE-003" } },
      update: {},
      create: {
        entityId: axentia.id,
        code: "AXE-003",
        name: "Asesoría Financiera",
        description: "Asesoría sobre gestión financiera y análisis de inversiones",
        category: "Finanzas",
        productType: "SERVICE",
        unitPrice: 1800000,
        cost: 900000,
        currency: "PYG",
        quantity: 0,
        unit: "sesión",
        taxRate: 10,
        status: "active",
      },
    });
    console.log("✓ Asesoría Financiera (Axentia):", axentiaProduct3.id);

    // =========================================================================
    // VERIFICACIÓN
    // =========================================================================
    console.log("\n✅ Verificando datos insertados...\n");

    const entitiesCount = await prisma.entity.count();
    const customersCount = await prisma.customer.count();
    const productsCount = await prisma.product.count();

    console.log("📊 Resumen:");
    console.log(`   - Entidades: ${entitiesCount}`);
    console.log(`   - Clientes: ${customersCount}`);
    console.log(`   - Productos/Servicios: ${productsCount}`);

    console.log("\n✨ Datos de prueba cargados exitosamente!");
  } catch (error) {
    console.error("❌ Error cargando datos:", error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

seedTestData();
