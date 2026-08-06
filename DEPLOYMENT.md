# Deployment — Private Office a Bluehost

Guía para desplegar la aplicación Private Office a `ronaldbarrios.com/private` en Bluehost.

## Requisitos previos

1. **Bluehost SSH access** — cPanel user/password (o SSH key)
2. **Node.js 18+ en Bluehost** — Bluehost debe tener Node.js instalado (revisar con cPanel)
3. **PostgreSQL en Render** — La BD ya está lista en `dpg-d9h8ov37uimc738hb9rg-a.ohio-postgres.render.com`
4. **Clerk credentials** — Credenciales configuradas en `.env.production`

## Pasos de deployment

### 1. Build local

```bash
cd app
npm install --include=dev
npm run build
```

Esto crea `.next/` con todo compilado y optimizado.

### 2. Ejecutar script de deployment

```bash
bash scripts/deploy.sh
```

El script:
- Verifica que el directorio esté limpio (o advierte)
- Instala dependencias
- Compila para producción
- Crea archivo de versión/timestamp
- Prepara archivos en carpeta temporal

### 3. Upload a Bluehost via SCP

Desde tu máquina local:

```bash
# Copiar .next/ y configuración a Bluehost
scp -r /tmp/private-office-deploy-*/  usuario@ronaldbarrios.com:~/public_html/private/

# O alternativamente, conectarse por SSH y hacer git clone/pull
ssh usuario@ronaldbarrios.com
cd public_html/private
git clone https://github.com/tu-usuario/private-office.git .
# o si ya existe:
git pull origin main
```

### 4. Instalar dependencias en Bluehost

```bash
ssh usuario@ronaldbarrios.com
cd public_html/private
npm install --omit=dev  # Solo dependencias de producción
```

### 5. Configurar variables de entorno

En Bluehost, asegurarse de que existe `.env`:

```bash
# Copiar desde .env.production
cp .env.production .env
```

Variables requeridas:
- `DATABASE_URL` — URL de Render PostgreSQL
- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` — Clerk public key
- `CLERK_SECRET_KEY` — Clerk secret key

### 6. Iniciar aplicación

**Opción A: Node directo (simple)**
```bash
npm start
```

**Opción B: PM2 (mejor para producción)**
```bash
npm install -g pm2
pm2 start "npm start" --name "private-office"
pm2 save
pm2 startup  # Reinicia con el servidor
```

**Opción C: Nginx reverse proxy** (si Bluehost lo soporta)
```
upstream private_office {
  server localhost:3000;
}

server {
  server_name ronaldbarrios.com;
  location /private/ {
    proxy_pass http://private_office/;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection 'upgrade';
    proxy_set_header Host $host;
    proxy_cache_bypass $http_upgrade;
  }
}
```

### 7. Verificar deployment

```bash
# Local o desde Bluehost
curl http://ronaldbarrios.com/private
# Debería devolver HTML de la página de inicio
```

## Troubleshooting

### "PORT 3000 already in use"
```bash
lsof -i :3000
kill -9 <PID>
```

### "Cannot find module 'next'"
```bash
npm install --omit=dev
```

### "DATABASE_URL not found"
- Verificar que `.env` existe en la carpeta de app
- Verificar que `prisma.config.ts` tiene `import "dotenv/config"`
- Verificar que la URL de Render es correcta

### "Clerk authentication not working"
- Verificar `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` y `CLERK_SECRET_KEY`
- En Bluehost, agregar `ronaldbarrios.com` a Clerk's allowed origins (clerk.com > app settings)

## Rollback (en caso de problema)

```bash
ssh usuario@ronaldbarrios.com
cd public_html/private

# Detener la app
pm2 stop private-office

# Revertir a versión anterior
git checkout HEAD~1

# Reinstalar y reiniciar
npm install --omit=dev
pm2 start private-office
```

## Actualizar después del deployment

Después de deploy, en desarrollo local:

```bash
git add .
git commit -m "Deploy: versión fecha"
git push origin main

# En Bluehost:
ssh usuario@ronaldbarrios.com
cd public_html/private
git pull origin main
npm install --omit=dev
pm2 restart private-office  # O pm2 reload
```

## Monitoreo

```bash
# Ver logs
pm2 logs private-office

# Ver estado
pm2 status

# CPU/Memory
pm2 monit
```

## Configuración futura (ADR-001)

Antes de go-live a producción real:
- [ ] Migrar a Prisma 7
- [ ] Implementar formal migration system (no `db push`)
- [ ] Configurar CI/CD pipeline (GitHub Actions → Bluehost)
- [ ] Implementar backup automático de base de datos
- [ ] Configurar SSL/TLS certificate en Bluehost
- [ ] Configurar analytics/monitoring en producción
- [ ] Revisar Clerk config para producción (keys, allowed origins)

---

**Última actualización:** 2026-08-06
