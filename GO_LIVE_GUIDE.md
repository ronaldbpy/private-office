# 🚀 Private Office — Go-Live Guide

Sistema administrativo-contable completo, listo para deployar en Bluehost.

## ✅ Completado

- [x] Base de datos PostgreSQL (Render)
- [x] Schema Prisma completo con modelos de negocio
- [x] Autenticación Clerk (listo para Google OAuth)
- [x] APIs REST completamente funcionales
- [x] Interfaz de usuario responsive
- [x] Dark mode + animations
- [x] Build producción compilado exitosamente

## 📊 Features Incluidos

### 1. **Gestión de Clientes** (`/customers`)
- Crear, listar, editar clientes
- Tipos: individual, business
- Límite de crédito por cliente
- Estado: activo, inactivo, archived

### 2. **Catálogo de Productos/Servicios** (`/products`)
- Código interno + nombre
- Precios unitarios + costos
- Impuestos (IVA)
- Gestión de inventario
- Categorización

### 3. **Cotizaciones** (`/quotes`)
- Crear cotizaciones de productos
- Vigencia configurable
- Estado: draft, sent, accepted, rejected, expired
- Ítems con precios calculados

### 4. **Facturas Compra/Venta** (`/invoices`)
- Facturas de venta (a clientes)
- Facturas de compra (de proveedores)
- Registro de pagos
- Moneda PYG
- Estado: draft, issued, paid, cancelled

### 5. **Eventos y Calendario** (`/events`)
- Crear eventos (Casa Amelia, operacionales, etc.)
- Tipos: event, reminder, alert, task
- Attendees + ubicación
- Calendario integrado

### 6. **Reportes Contables** (`/accounting-reports`)
- Reportes para enviar al contador
- Tipos: balance sheet, income statement, cash flow, trial balance, journal
- Período (YYYY-MM)
- HTML exportable

## 🛠️ Deployment a Bluehost

### Opción A: Automatizado (Recomendado)

```bash
cd /Users/ronaldbarrios/Developer/private-office
bash BLUEHOST_DEPLOY.sh <usuario_bluehost> <host_bluehost>
```

Ejemplo:
```bash
bash BLUEHOST_DEPLOY.sh myuser box2638.bluehost.com
```

**¿Dónde encontrar las credenciales?**
- Bluehost cPanel → Home → Account
- Usuario: (email o username)
- Host: `box2638.bluehost.com` (o tu servidor)

### Opción B: Manual

**1. Preparar build:**
```bash
cd app
npm install --include=dev
npm run build
```

**2. Conectar a Bluehost:**
```bash
ssh usuario@box2638.bluehost.com
cd public_html/website_e6b173ec
```

**3. Subir archivos (desde tu máquina):**
```bash
scp -r app/.next usuario@box2638.bluehost.com:~/public_html/website_e6b173ec/
scp app/package.json usuario@box2638.bluehost.com:~/public_html/website_e6b173ec/
scp app/.env.production usuario@box2638.bluehost.com:~/public_html/website_e6b173ec/.env
```

**4. En Bluehost (SSH):**
```bash
npm install --omit=dev
pm2 start "npm start" --name "private-office"
pm2 save
```

## 🔐 Configuración Clerk (Google OAuth)

**IMPORTANTE: Configurar ANTES de go-live**

1. Ir a: https://dashboard.clerk.com/apps
2. Ir a: Settings → Instances Settings
3. Scroll a: "Allowed Origins"
4. Agregar: `https://ronaldbarrios.com`
5. Guardar

**Para Google OAuth:**
1. Settings → Social Connections → Google
2. Conectar Google Cloud project
3. Configurar callback URLs

## 📱 URLs de Acceso

| Sección | URL |
|---------|-----|
| Home | `https://ronaldbarrios.com/private` |
| Clientes | `https://ronaldbarrios.com/private/customers` |
| Productos | `https://ronaldbarrios.com/private/products` |
| Cotizaciones | `https://ronaldbarrios.com/private/quotes` |
| Facturas | `https://ronaldbarrios.com/private/invoices` |
| Eventos | `https://ronaldbarrios.com/private/events` |
| API Docs | `https://ronaldbarrios.com/private/api/docs` |

## ⚙️ Variables de Entorno

El archivo `.env.production` debe estar en Bluehost:

```
DATABASE_URL=postgresql://...render.com/private_office_db
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
```

## 📊 Acceso en Cascada

El sistema soporta multi-tenant:
- **Usuarios internos**: Acceso a múltiples empresas via cascading permissions
- **Roles**: OWNER, ADMINISTRADOR_HOLDING, CONTADOR, GERENTE, ASISTENTE
- **Cascading**: Un holding otorga acceso automático a sus subsidiarias

## 🔍 Verificar Deploy

```bash
# Logs en vivo
ssh usuario@box2638.bluehost.com "pm2 logs private-office"

# Estado
ssh usuario@box2638.bluehost.com "pm2 status"

# Health check (después de estar activo)
curl https://ronaldbarrios.com/private/api/health
```

## 📈 Datos Iniciales Cargados

- ✅ Casa Amelia EAS (RUC 80154598-6)
- ✅ Axentia EAS (RUC 80175241-8)
- ✅ Perfil Personal (RUC 3676596-1)

**Crear más entidades:**
1. Dashboard → Entidades → Crear
2. Completar datos legales
3. Asignar usuarios con roles

## 🐛 Troubleshooting

### "Cannot find module 'next'"
```bash
ssh usuario@box2638.bluehost.com
cd ~/public_html/website_e6b173ec
npm install --omit=dev
```

### "PORT 3000 already in use"
```bash
pm2 kill
pm2 start "npm start" --name "private-office"
```

### "DATABASE_URL not found"
- Verificar `.env` en Bluehost: `cat ~/.../. env`
- Debe tener `DATABASE_URL=...`

### App carga pero muestra 404
- Verificar Clerk config en dashboard
- Verificar que ronaldbarrios.com está en Allowed Origins
- Verificar logs: `pm2 logs private-office`

## 📞 Support

- **Render DB**: https://render.com/dashboard → PostgreSQL → private_office_db
- **Clerk**: https://dashboard.clerk.com
- **Bluehost**: cPanel File Manager o SSH

## 🎯 Próximos Pasos (Post-Deploy)

1. **Testing completo** en staging
2. **Backup automático** de BD (Render + local)
3. **Configurar SSL** en Bluehost (si no está)
4. **Analytics** (opcional: Vercel Analytics)
5. **Monitoring** (pm2 plus, alertas)

---

**Sistema listo. ¡A volar! 🚀**

Ejecuta: `bash BLUEHOST_DEPLOY.sh <usuario> <host>`
