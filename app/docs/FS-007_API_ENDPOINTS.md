# FS-007 — API Endpoints

## Overview

REST API para acceder a datos de Private Office desde clientes internos y externos. Todos los endpoints respetan FS-005 (access control) — un usuario solo ve datos de entidades a las que tiene acceso.

## Base

```
GET /api/v1/...
Authorization: Bearer <clerk-session-token> (vía Next.js middleware)
```

## Endpoints

### Entities

```
GET /api/v1/entities
→ { entities: Entity[] }
  - Solo entidades accesibles por usuario
  - Incluye accountName, colorToken, status
  - Relaciones: ownership, access level
```

```
GET /api/v1/entities/:id
→ { entity: Entity, ownership: OwnershipInterest[], parties: Party[] }
  - Verificar acceso a entidad
  - Incluir estructura de propiedad completa
```

### Treasury (FS-006)

```
GET /api/v1/accounts
→ { accounts: Account[] }
  - Cuentas de entidades accesibles
  - Incluye últimos 3 meses de balances
```

```
GET /api/v1/accounts/:id
→ { account: Account, balances: AccountBalance[], movements: AccountMovement[] }
  - Saldos históricos (últimos 12 meses)
  - Últimos 50 movimientos
  - Verificar acceso a entidad propietaria
```

```
POST /api/v1/accounts/:id/balances
→ { balance: AccountBalance }
  - Crear nuevo saldo (importación)
  - Requiere CONTADOR/ADMINISTRADOR role
  - Auditoría: grabar quién, cuándo, qué se modificó
```

### Vault (FS-016)

```
GET /api/v1/documents
→ { documents: Document[] }
  - Documentos de entidades accesibles
  - Sin contenido (metadata solo)
  - Paginación: take/skip
```

```
GET /api/v1/documents/:id/download
→ [file bytes]
  - Descargar documento
  - Auditoría (accessLog)
  - Verificar clasificación + acceso
```

```
POST /api/v1/documents
→ { document: Document }
  - Subir documento
  - Multipart form-data
  - Grabar uploadedBy, contentHash, classification
  - Auditoría: acción "upload"
```

### Obligations (FS-017)

```
GET /api/v1/obligations
→ { obligations: Obligation[], dueRules: ObligationDueRule[] }
  - Obligaciones de entidades accesibles
  - Incluir próximas 90 días
  - Agrupar por código + fecha de vencimiento
```

## Error Handling

```
401 Unauthorized
→ Sesión expirada o inválida

403 Forbidden
→ Usuario sin acceso a recurso

404 Not Found
→ Recurso no existe

422 Unprocessable Entity
→ Validación fallida (datos inválidos)

500 Internal Server Error
→ Error del servidor (loguear, no exponer detalles)
```

## Security Rules (SEC-001, SEC-002)

- Auditoría: toda lectura de documento RESTRICTED queda registrada
- Clasificación: respetar niveles (RESTRICTED, CONFIDENTIAL, INTERNAL, PUBLIC)
- Roles: algunas operaciones requieren role específico (CONTADOR, ADMINISTRADOR, etc.)
- Rate limiting: implementar después (MVP sin límite)
