# Prompt para Claude Chrome Extension — Verificación Bluehost

Copia este prompt en Claude dentro de Chrome para verificar que todo está corriendo en Bluehost.

---

## PROMPT COMPLETO (Copiar y pegar en Claude Chrome)

```
Soy el admin de una aplicación Next.js en Bluehost (ronaldbarrios.com/private).
Necesito verificar que está correctamente deployada y funcionando.

Por favor, actúa como verificador de deployment. Tu tarea:

1. **Acceder a la URL principal**: https://ronaldbarrios.com/private
   - ¿Carga la página?
   - ¿Muestra "Iniciar sesión" o formulario de login?
   - ¿Hay errores de consola? (abre DevTools F12)

2. **Verificar autenticación Clerk**:
   - Click en botón de login
   - ¿Ofrece "Sign in with Google"?
   - ¿O solo acepta email/password?

3. **Verificar páginas principales** (necesitas estar logeado):
   - /customers (lista de clientes vacía es OK)
   - /products (lista de productos vacía es OK)
   - /invoices (lista de facturas vacía es OK)
   - /quotes (lista de cotizaciones vacía es OK)
   - /events (lista de eventos vacía es OK)
   - ¿Cargan? ¿Tienen estructura correcta?

4. **Verificar navbar**:
   - ¿Aparecen todos los links (Home, Entidades, Clientes, Productos, Cotizaciones, Facturas, Eventos)?
   - ¿Dark mode toggle funciona? (en top right)

5. **Verificar APIs** (en DevTools → Network):
   - GET https://ronaldbarrios.com/private/api/v1/customers → Status 200?
   - GET https://ronaldbarrios.com/private/api/v1/products → Status 200?
   - GET https://ronaldbarrios.com/private/api/v1/invoices → Status 200?

6. **Verificar documentación API**:
   - https://ronaldbarrios.com/private/api/docs → ¿Carga Swagger UI?
   - ¿Muestra endpoints listados?

7. **Reportar estado**:
   - ✅ = funciona
   - ❌ = error
   - ⚠️ = parcialmente
   - 🔧 = necesita configuración

Formato de reporte:
```
🌐 **DEPLOYMENT VERIFICATION**

**Main URL**: ✅/❌/⚠️
**Authentication (Clerk)**: ✅/❌/⚠️
**Pages Load**:
  - /customers: ✅/❌/⚠️
  - /products: ✅/❌/⚠️
  - /invoices: ✅/❌/⚠️
  - /quotes: ✅/❌/⚠️
  - /events: ✅/❌/⚠️
**Navbar & Dark Mode**: ✅/❌/⚠️
**API Endpoints**: ✅/❌/⚠️
**API Docs (Swagger)**: ✅/❌/⚠️

**Errores encontrados** (si hay):
- [lista de errores con screenshots]

**Status general**: ✅ READY / 🔧 NEEDS CONFIG / ❌ DOWN
```

**Si algo no funciona, incluye**:
- Screenshot del error
- Console error (F12 → Console)
- Network tab status codes
- Sugerencia de fix
```

---

## ALTERNATIVA RÁPIDA (versión corta)

```
Verifica que https://ronaldbarrios.com/private está up:
1. ¿Carga la página? (devtools F12)
2. ¿Pide login?
3. Abre DevTools → Console y Network
4. Intenta ir a /customers, /products, /invoices, /quotes, /events
5. Reporta con ✅❌⚠️ que funciona y qué errores hay
```

---

## NOTAS

- Si pide login pero muestra error: **Clerk no configurado** (necesita `CLERK_SECRET_KEY` en .env)
- Si muestra 404: **Archivos no subidos** (revisar cPanel File Manager)
- Si muestra "Cannot find module": **npm install no corrió** (SSH a Bluehost y `npm install --omit=dev`)
- Si página lenta: **Node.js arrancando** (esperar 60 segundos)
- Si muestra "502 Bad Gateway": **PM2 no corrió** (SSH y `pm2 start 'npm start' --name 'private-office'`)

---

## ESTADO ESPERADO CUANDO TODO FUNCIONA

✅ URL principal carga sin errores
✅ Pide login via Clerk (Google OAuth recomendado)
✅ Después de login, ve dashboard
✅ Navbar muestra: Home | Entidades | Clientes | Productos | Cotizaciones | Facturas | Eventos | ...
✅ Dark mode toggle en top right
✅ Todas las páginas cargan (aunque estén vacías)
✅ API endpoints responden con JSON (DevTools → Network)
✅ /api/docs muestra Swagger UI con todas las rutas

---

## ACCIONES SI FALLA

**No carga URL**:
- Espera 2 minutos (Node.js arrancando)
- Revisa cPanel Terminal: `pm2 status`
- Reinicia: `pm2 restart private-office`

**Error de autenticación Clerk**:
- Abre https://dashboard.clerk.com
- Ve a Settings → Instances Settings → Allowed Origins
- Agrega: `https://ronaldbarrios.com`
- Guarda y espera 30 segundos

**APIs dan 401 (Unauthorized)**:
- Verifica que estés logeado
- Revisa DevTools Network → Authorization header
- Debe tener: `Authorization: Bearer [token]`

**Páginas cargan pero no muestran datos**:
- Base de datos en Render OK (verificar en https://render.com/dashboard)
- APIs funcionan (verificar /api/v1/customers da JSON array)
- Es normal si es primera vez (no hay datos cargados)

```

---

## CÓMO USARLO

1. Abre Claude en Chrome extension (Cmd+Shift+L en Mac)
2. Copia el prompt completo
3. Pega en chat de Claude
4. Envía mensaje
5. Claude va a acceder a las URLs y verificar

Claude va a reportar status completo con ✅❌⚠️ para cada componente.
