-- ============================================================================
-- DATOS DE PRUEBA CARGADOS EN POSTGRESQL RENDER - PRIVATE OFFICE
-- Fecha: 2026-08-12
-- Script Utilizado: app/scripts/seed-test-data.ts
-- ============================================================================

-- Equivalente SQL de los datos cargados vía Prisma
-- NOTA: Los IDs fueron generados automáticamente por Prisma (UUIDs)

-- ============================================================================
-- 1. ENTIDADES (3 empresas)
-- ============================================================================

INSERT INTO entities
  (id, name, type, "companyType", "taxId", jurisdiction, "baseCurrency",
   address, phone, email, "colorToken", status, "createdAt", "updatedAt")
VALUES
  -- RUC Personal (3676596-1)
  ('ruc-personal-1', 'RUC Personal', 'LEGAL_ENTITY', 'PERSONAL_SERVICE',
   '3676596-1', 'Paraguay', 'PYG',
   'Asunción, Paraguay', '+595 961 234567', 'ruc.personal@example.com',
   'cat-3', 'active', NOW(), NOW()),

  -- Casa Amelia (alquileres y eventos)
  ('casa-amelia-1', 'Casa Amelia EAS', 'LEGAL_ENTITY', 'EVENT_SERVICES',
   '80154598-6', 'Paraguay', 'PYG',
   'Calle Nuestra Sra del Carmen esq. San Martín, Nº 1321, Asunción',
   '(0972)590909', 'casaaameliapyy@gmail.com', 'cat-2', 'active', NOW(), NOW()),

  -- Axentia (consultoría)
  ('axentia-1', 'Axentia EAS', 'LEGAL_ENTITY', 'CONSULTING',
   '80175241-8', 'Paraguay', 'PYG',
   'Villa Amelia Aregua, San Lorenzo', '(0972)590909', 'ronaldpy@gmail.com',
   'cat-1', 'active', NOW(), NOW())
ON CONFLICT (id) DO UPDATE SET "companyType" = EXCLUDED."companyType";

-- ============================================================================
-- 2. CLIENTES (2 por empresa = 6 clientes)
-- ============================================================================

-- RUC Personal - Clientes
INSERT INTO customers
  ("entityId", "fullName", "businessName", "taxId", phone, email, address,
   city, country, "customerType", status, "creditLimit", "creditUsed",
   "createdAt", "updatedAt")
VALUES
  ('ruc-personal-1', 'Cliente A', 'Empresa A SRL', 'ruc-cliente-a-1',
   '+595 961 111111', 'clientea@example.com', 'Asunción, Paraguay',
   'Asunción', 'Paraguay', 'business', 'active', NULL, 0, NOW(), NOW()),

  ('ruc-personal-1', 'Cliente B', 'Empresa B SRL', 'ruc-cliente-b-1',
   '+595 961 222222', 'clienteb@example.com', 'Asunción, Paraguay',
   'Asunción', 'Paraguay', 'business', 'active', NULL, 0, NOW(), NOW());

-- Casa Amelia - Clientes (eventos)
INSERT INTO customers
  ("entityId", "fullName", "businessName", "taxId", phone, email, address,
   city, country, "customerType", status, "creditLimit", "creditUsed",
   "createdAt", "updatedAt")
VALUES
  ('casa-amelia-1', 'Cliente Evento 1', 'Empresa de Eventos A', 'evento-cliente-1-1',
   '+595 961 333333', 'evento1@example.com', 'Asunción, Paraguay',
   'Asunción', 'Paraguay', 'business', 'active', NULL, 0, NOW(), NOW()),

  ('casa-amelia-1', 'Cliente Evento 2', 'Empresa de Eventos B', 'evento-cliente-2-1',
   '+595 961 444444', 'evento2@example.com', 'Asunción, Paraguay',
   'Asunción', 'Paraguay', 'business', 'active', NULL, 0, NOW(), NOW());

-- Axentia - Clientes (consultoría)
INSERT INTO customers
  ("entityId", "fullName", "businessName", "taxId", phone, email, address,
   city, country, "customerType", status, "creditLimit", "creditUsed",
   "createdAt", "updatedAt")
VALUES
  ('axentia-1', 'Cliente Consultoría 1', 'Empresa de Consultoría A', 'axentia-cliente-cons-1',
   '+595 961 555555', 'consult1@example.com', 'Asunción, Paraguay',
   'Asunción', 'Paraguay', 'business', 'active', NULL, 0, NOW(), NOW()),

  ('axentia-1', 'Cliente Consultoría 2', 'Empresa de Consultoría B', 'axentia-cliente-cons-2',
   '+595 961 666666', 'consult2@example.com', 'Asunción, Paraguay',
   'Asunción', 'Paraguay', 'business', 'active', NULL, 0, NOW(), NOW());

-- ============================================================================
-- 3. PRODUCTOS/SERVICIOS (3 por empresa = 9 productos)
-- ============================================================================

-- RUC Personal - Servicios contables
INSERT INTO products
  ("entityId", code, name, description, category, "productType",
   "unitPrice", cost, currency, quantity, unit, "taxRate", status,
   "createdAt", "updatedAt")
VALUES
  ('ruc-personal-1', 'RUC-001', 'Facturación',
   'Servicio de facturación contable', 'Servicios Contables', 'SERVICE',
   500000, 250000, 'PYG', 0, 'servicio', 10, 'active', NOW(), NOW()),

  ('ruc-personal-1', 'RUC-002', 'Contabilidad',
   'Servicio de contabilidad anual', 'Servicios Contables', 'SERVICE',
   1000000, 500000, 'PYG', 0, 'servicio', 10, 'active', NOW(), NOW()),

  ('ruc-personal-1', 'RUC-003', 'Impuestos',
   'Asesoría sobre obligaciones tributarias', 'Servicios Contables', 'SERVICE',
   750000, 375000, 'PYG', 0, 'servicio', 10, 'active', NOW(), NOW());

-- Casa Amelia - Servicios de eventos
INSERT INTO products
  ("entityId", code, name, description, category, "productType",
   "unitPrice", cost, currency, quantity, unit, "taxRate", status,
   "createdAt", "updatedAt")
VALUES
  ('casa-amelia-1', 'AME-001', 'Alquiler Local',
   'Alquiler de local para eventos', 'Alquileres', 'SERVICE',
   2000000, 1000000, 'PYG', 1, 'evento', 10, 'active', NOW(), NOW()),

  ('casa-amelia-1', 'AME-002', 'Catering',
   'Servicio de catering para eventos', 'Comidas', 'SERVICE',
   1500000, 750000, 'PYG', 0, 'persona', 10, 'active', NOW(), NOW()),

  ('casa-amelia-1', 'AME-003', 'Sonido e Iluminación',
   'Servicio de sonido e iluminación profesional', 'Equipamiento', 'SERVICE',
   1000000, 500000, 'PYG', 0, 'evento', 10, 'active', NOW(), NOW());

-- Axentia - Servicios de consultoría
INSERT INTO products
  ("entityId", code, name, description, category, "productType",
   "unitPrice", cost, currency, quantity, unit, "taxRate", status,
   "createdAt", "updatedAt")
VALUES
  ('axentia-1', 'AXE-001', 'Consultoría General',
   'Consultoría empresarial general', 'Consultoría', 'SERVICE',
   2000000, 1000000, 'PYG', 0, 'hora', 10, 'active', NOW(), NOW()),

  ('axentia-1', 'AXE-002', 'Administración de Inmuebles',
   'Servicio de administración y gestión de propiedades', 'Administración', 'SERVICE',
   1500000, 750000, 'PYG', 0, 'mes', 10, 'active', NOW(), NOW()),

  ('axentia-1', 'AXE-003', 'Asesoría Financiera',
   'Asesoría sobre gestión financiera y análisis de inversiones', 'Finanzas', 'SERVICE',
   1800000, 900000, 'PYG', 0, 'sesión', 10, 'active', NOW(), NOW());

-- ============================================================================
-- VERIFICACIÓN DE DATOS CARGADOS
-- ============================================================================

-- Ejecutar estas queries para verificar:

-- 1. Contar entidades con companyType
SELECT COUNT(*) as "Total Entidades"
FROM entities
WHERE "companyType" IN ('PERSONAL_SERVICE', 'EVENT_SERVICES', 'CONSULTING');
-- Resultado esperado: 3

-- 2. Contar clientes asociados a estas entidades
SELECT COUNT(*) as "Total Clientes"
FROM customers c
JOIN entities e ON c."entityId" = e.id
WHERE e."companyType" IN ('PERSONAL_SERVICE', 'EVENT_SERVICES', 'CONSULTING');
-- Resultado esperado: 6

-- 3. Contar productos/servicios de estas entidades
SELECT COUNT(*) as "Total Productos/Servicios"
FROM products p
JOIN entities e ON p."entityId" = e.id
WHERE e."companyType" IN ('PERSONAL_SERVICE', 'EVENT_SERVICES', 'CONSULTING');
-- Resultado esperado: 9

-- 4. Resumen por entidad
SELECT
  e.name as "Entidad",
  e."companyType" as "Tipo",
  COUNT(DISTINCT c.id) as "Clientes",
  COUNT(DISTINCT p.id) as "Productos"
FROM entities e
LEFT JOIN customers c ON c."entityId" = e.id
LEFT JOIN products p ON p."entityId" = e.id
WHERE e."companyType" IN ('PERSONAL_SERVICE', 'EVENT_SERVICES', 'CONSULTING')
GROUP BY e.id, e.name, e."companyType"
ORDER BY e.name;
