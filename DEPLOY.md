# Deploy a Render

## Pasos

### 1. Conectar Render a GitHub

1. Ve a https://render.com/dashboard
2. Click "New +" → "Web Service"
3. Conecta tu repositorio GitHub: https://github.com/ronaldbpy/private-office
4. Branch: `main`

### 2. Configurar Web Service

**Name**: `private-office`
**Root Directory**: `.` (raíz del repo)
**Build Command**: 
```
cd app && npm install --include=dev && npm run build
```

**Start Command**: 
```
cd app && npm start
```

**Plan**: Standard ($7/month mínimo)

### 3. Environment Variables

Agregar las siguientes en Render Dashboard:

```
NODE_ENV=production
DATABASE_URL=postgresql://[user]:[password]@[host]:[port]/private_office_db
CLERK_SECRET_KEY=[tu-secret-key]
CLERK_PUBLISHABLE_KEY=[tu-publishable-key]
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=[tu-publishable-key]
```

**Conseguir valores:**
- `DATABASE_URL`: Ya en Render (copy de tu DB existente)
- Clerk keys: https://dashboard.clerk.com → Settings → API Keys

### 4. Deploy

1. Click "Create Web Service"
2. Render inicia build automático
3. Espera ~10 minutos
4. URL será: `https://private-office.render.com`

### 5. Configurar Clerk

En https://dashboard.clerk.com:

**Settings → Allowed Origins**
- Agregar: `https://private-office.render.com`

**Settings → Instances Settings**
- Verificar URLs autorizadas

### 6. Test

```bash
curl https://private-office.render.com/api/health
# Debería responder: {"status":"ok"}
```

Luego ir a:
https://private-office.render.com/

## Troubleshooting

**Build falla:**
- Revisar Render Logs
- Verificar `cd app && npm run build` compila localmente
- Verificar NODE_ENV=production

**App lenta al arrancar:**
- Render pone servicios en sleep si no hay traffic
- Primera request demora ~30s
- Agregar uptime monitor para mantenerlo activo

**DB connection error:**
- Verificar DATABASE_URL en Render
- Verificar firewall Render DB

## Rollback

Si algo sale mal:
```bash
git revert [commit-sha]
git push origin main
# Render redeploy automático
```
