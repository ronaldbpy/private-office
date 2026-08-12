# Carga de Datos de Prueba - Private Office DB Render

**Fecha**: 2026-08-12  
**Base de Datos**: PostgreSQL Render (dpg-d9h8ov37uimc738hb9rg-a.ohio-postgres.render.com)  
**Proyecto**: Private Office

---

## Resumen Ejecutivo

✅ **ÉXITO**: Se cargaron 18 registros de prueba en la base de datos PostgreSQL de Render.

- **3 Entidades** (empresas)
- **6 Clientes** (2 por empresa)
- **9 Productos/Servicios** (3 por empresa)

---

## Método Utilizado

Se utilizó **Prisma ORM** (v6.x) con TypeScript para realizar la carga de datos.

### Scripts Creados

1. **`app/scripts/seed-test-data.ts`**
   - Script principal que carga los datos
   - Utiliza `prisma.entity.upsert()`, `prisma.customer.upsert()`, `prisma.product.upsert()`
   - Evita duplicados si los datos ya existen
   - Ejecutado con: `npx tsx scripts/seed-test-data.ts`

2. **`app/scripts/verify-seed.ts`**
   - Script de verificación que consulta y muestra los datos cargados
   - Agrupa clientes y productos por entidad
   - Muestra resumen final

3. **`app/scripts/test-data-loaded.sql`**
   - Equivalente SQL directo de los datos cargados
   - Puede ejecutarse manualmente si se prefiere
   - Incluye queries de verificación

---

## Datos Cargados

### 1. ENTIDADES (3)

| ID | Nombre | Tipo | RUC | Tipo Empresa | Estado |
|----|--------|------|-----|--------------|--------|
| ruc-personal-1 | RUC Personal | LEGAL_ENTITY | 3676596-1 | PERSONAL_SERVICE | active |
| casa-amelia-1 | Casa Amelia EAS | LEGAL_ENTITY | 80154598-6 | EVENT_SERVICES | active |
| axentia-1 | Axentia EAS | LEGAL_ENTITY | 80175241-8 | CONSULTING | active |

---

### 2. CLIENTES (6 total)

#### RUC Personal (2 clientes)
1. **Cliente A** (Empresa A SRL)
   - Email: clientea@example.com
   - Teléfono: +595 961 111111
   - Estado: active

2. **Cliente B** (Empresa B SRL)
   - Email: clienteb@example.com
   - Teléfono: +595 961 222222
   - Estado: active

#### Casa Amelia EAS (2 clientes)
3. **Cliente Evento 1** (Empresa de Eventos A)
   - Email: evento1@example.com
   - Teléfono: +595 961 333333
   - Estado: active

4. **Cliente Evento 2** (Empresa de Eventos B)
   - Email: evento2@example.com
   - Teléfono: +595 961 444444
   - Estado: active

#### Axentia EAS (2 clientes)
5. **Cliente Consultoría 1** (Empresa de Consultoría A)
   - Email: consult1@example.com
   - Teléfono: +595 961 555555
   - Estado: active

6. **Cliente Consultoría 2** (Empresa de Consultoría B)
   - Email: consult2@example.com
   - Teléfono: +595 961 666666
   - Estado: active

---

### 3. PRODUCTOS/SERVICIOS (9 total)

#### RUC Personal (3 servicios contables)
| Código | Nombre | Descripción | Precio | Moneda | Estado |
|--------|--------|-------------|--------|--------|--------|
| RUC-001 | Facturación | Servicio de facturación contable | 500,000 | PYG | active |
| RUC-002 | Contabilidad | Servicio de contabilidad anual | 1,000,000 | PYG | active |
| RUC-003 | Impuestos | Asesoría sobre obligaciones tributarias | 750,000 | PYG | active |

#### Casa Amelia EAS (3 servicios de eventos)
| Código | Nombre | Descripción | Precio | Moneda | Estado |
|--------|--------|-------------|--------|--------|--------|
| AME-001 | Alquiler Local | Alquiler de local para eventos | 2,000,000 | PYG | active |
| AME-002 | Catering | Servicio de catering para eventos | 1,500,000 | PYG | active |
| AME-003 | Sonido e Iluminación | Servicio de sonido e iluminación profesional | 1,000,000 | PYG | active |

#### Axentia EAS (3 servicios de consultoría)
| Código | Nombre | Descripción | Precio | Moneda | Estado |
|--------|--------|-------------|--------|--------|--------|
| AXE-001 | Consultoría General | Consultoría empresarial general | 2,000,000 | PYG | active |
| AXE-002 | Administración de Inmuebles | Servicio de administración y gestión de propiedades | 1,500,000 | PYG | active |
| AXE-003 | Asesoría Financiera | Asesoría sobre gestión financiera y análisis de inversiones | 1,800,000 | PYG | active |

---

## Resultados de Ejecución

```
🌱 Iniciando carga de datos de prueba...
📋 Creando entidades...
✓ RUC Personal: ruc-personal-1
✓ Casa Amelia EAS: casa-amelia-1
✓ Axentia EAS: axentia-1
👥 Creando clientes...
✓ Cliente A (RUC Personal): c9fe83da-741e-440e-b3f6-a262085d6cb0
✓ Cliente B (RUC Personal): 32ba7629-51a6-4b1e-9d0d-98c305024a40
✓ Cliente Evento 1 (Casa Amelia): 23fc6a28-fd09-4593-be30-d0730ca27858
✓ Cliente Evento 2 (Casa Amelia): 929a756b-703c-4e1c-ae2e-7e0ec807cdce
✓ Cliente Consultoría 1 (Axentia): 4da01120-1ce1-49f7-9c31-a445d83fb744
✓ Cliente Consultoría 2 (Axentia): 22e9a8e6-90c2-4312-b7ee-6745637d08d9
🛍️  Creando productos/servicios...
✓ Facturación (RUC): afc74883-a376-4448-a3e3-95de939f086c
✓ Contabilidad (RUC): 6bf4e9f7-7a6c-481a-ae36-02d1c6fbbfe6
✓ Impuestos (RUC): 008ab172-b192-4033-ad37-c6a20a199f07
✓ Alquiler Local (Casa Amelia): b368ab50-d321-468a-98fd-be36b81d029f
✓ Catering (Casa Amelia): f531f355-dd14-430f-b0b8-19822ee85f0e
✓ Sonido (Casa Amelia): 2aa2aee4-615c-4d97-9002-2a03b37deae6
✓ Consultoría General (Axentia): 4b02c2b0-78d8-418e-bbbc-20f9e8432d27
✓ Administración Inmuebles (Axentia): 560fbe1e-847b-492b-94ee-81aaf20da523
✓ Asesoría Financiera (Axentia): 5f8756ec-e341-4a65-9180-1b4bab392c93
✅ Verificando datos insertados...

📊 Resumen:
   - Entidades: 10 (incluyendo previamente existentes)
   - Clientes: 6
   - Productos/Servicios: 9
✨ Datos de prueba cargados exitosamente!
```

---

## Cómo Usar los Scripts

### Ejecutar carga de datos (primera vez o re-carga)
```bash
cd app
npx tsx scripts/seed-test-data.ts
```

### Verificar datos cargados
```bash
cd app
npx tsx scripts/verify-seed.ts
```

### Ejecutar SQL directo (alternativa)
```bash
psql "postgresql://private_office_db_user:knAUXd4nIndbfxpi8VbAtyQm1GXVg5fE@dpg-d9h8ov37uimc738hb9rg-a.ohio-postgres.render.com/private_office_db" < app/scripts/test-data-loaded.sql
```

---

## Archivos Generados/Modificados

### Nuevos Scripts
- ✅ `/app/scripts/seed-test-data.ts` - Script principal de carga (TypeScript/Prisma)
- ✅ `/app/scripts/verify-seed.ts` - Script de verificación (TypeScript/Prisma)
- ✅ `/app/scripts/test-data-loaded.sql` - Equivalente SQL directo

### Documentación
- ✅ `/scratchpad/CARGA_DATOS_RESUMEN.md` (este archivo)
- ✅ `/scratchpad/test-data-loaded.sql` (copia de seguridad)

---

## Verificación Manual en BD

### Contar registros por tipo
```sql
-- Entidades
SELECT COUNT(*) as "Total Entidades"
FROM entities
WHERE "companyType" IN ('PERSONAL_SERVICE', 'EVENT_SERVICES', 'CONSULTING');

-- Clientes
SELECT COUNT(*) as "Total Clientes"
FROM customers c
JOIN entities e ON c."entityId" = e.id
WHERE e."companyType" IN ('PERSONAL_SERVICE', 'EVENT_SERVICES', 'CONSULTING');

-- Productos
SELECT COUNT(*) as "Total Productos"
FROM products p
JOIN entities e ON p."entityId" = e.id
WHERE e."companyType" IN ('PERSONAL_SERVICE', 'EVENT_SERVICES', 'CONSULTING');
```

**Resultados esperados**: 3, 6, 9

---

## Notas Importantes

1. **Idempotencia**: Los scripts usan `upsert()` de Prisma, lo que significa que si se ejecutan nuevamente:
   - Entidades: Se actualizarán si ya existen (sin duplicados)
   - Clientes y Productos: Se crearán solo si no existen (basado en unique constraints)

2. **IDs Personalizados**: Las entidades usan IDs legibles (`ruc-personal-1`, `casa-amelia-1`, `axentia-1`)
   - Los clientes y productos reciben UUIDs automáticos

3. **Estados**: Todos los registros se crean con `status: "active"`

4. **Moneda**: Todos los precios están en PYG (Guaraní paraguayo)

5. **Configuración**: Los scripts leen automáticamente `DATABASE_URL` de `.env.production`

---

## Próximos Pasos Sugeridos

1. **Probar API endpoints** con los datos cargados:
   - GET `/api/v1/entities` - Ver las 3 empresas
   - GET `/api/v1/customers?entityId=ruc-personal-1` - Ver clientes de RUC
   - GET `/api/v1/products?entityId=casa-amelia-1` - Ver servicios de Amelia

2. **Crear cotizaciones/facturas** usando los datos de prueba
   - Los UUIDs de clientes y productos están disponibles para usar en quotes e invoices

3. **Configurar acceso de usuarios** (UserAccess) a estas entidades si es necesario

---

## Contacto/Soporte

Base de datos: PostgreSQL Render (privada)  
Proyecto: Private Office  
Fecha de ejecución: 2026-08-12 14:45 UTC
