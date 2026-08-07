#!/bin/bash
set -e

# Credenciales FTP/SFTP
FTP_USER="ronaldpy@elq.lvu.mybluehost.me"
FTP_HOST="ftp.elq.lvu.mybluehost.me"
FTP_PASS="Nderakore596!"
REMOTE_PATH="public_html/website_e6b173ec"

DEPLOY_DATE=$(date "+%Y%m%d_%H%M%S")

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Private Office → Bluehost"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

cd app

echo "📦 Build producción..."
npm install --include=dev
npm run build

echo "✓ Build completado"
echo ""

echo "🔄 Preparando archivos..."
DEPLOY_DIR="/tmp/private-office-${DEPLOY_DATE}"
mkdir -p "$DEPLOY_DIR"

cp -r .next "$DEPLOY_DIR/"
cp -r public "$DEPLOY_DIR/" 2>/dev/null || true
cp package.json package-lock.json "$DEPLOY_DIR/"
cp .env.production "$DEPLOY_DIR/.env" 2>/dev/null || echo "⚠️  .env.production no encontrado"

echo "✓ Archivos listos: $DEPLOY_DIR"
echo ""

echo "📤 Subiendo a Bluehost via SFTP..."

# Crear script SFTP batch
SFTP_BATCH="/tmp/sftp_batch_${DEPLOY_DATE}.txt"
cat > "$SFTP_BATCH" << 'SFTP_EOF'
cd public_html/website_e6b173ec
put -r .next
put -r public
put package.json
put .env
quit
SFTP_EOF

# Ejecutar SFTP con password no-interactivo
sshpass -p "$FTP_PASS" sftp -o StrictHostKeyChecking=no -o UserKnownHostsFile=/dev/null \
  -b "$SFTP_BATCH" "$FTP_USER@$FTP_HOST" 2>&1 | grep -v "Warning\|Authenticity" || true

echo "✓ Archivos subidos"
echo ""

echo "⚙️  Instalando dependencias en Bluehost..."
# Usar SSH para instalar (SFTP solo para archivos)
sshpass -p "$FTP_PASS" ssh -o StrictHostKeyChecking=no -o UserKnownHostsFile=/dev/null \
  "$FTP_USER@$FTP_HOST" \
  "cd ~/$REMOTE_PATH && npm install --omit=dev" 2>&1 | tail -10 || true

echo ""
echo "🚀 Iniciando aplicación..."
sshpass -p "$FTP_PASS" ssh -o StrictHostKeyChecking=no -o UserKnownHostsFile=/dev/null \
  "$FTP_USER@$FTP_HOST" \
  "cd ~/$REMOTE_PATH && pm2 stop private-office 2>/dev/null || true && pm2 start 'npm start' --name 'private-office' && pm2 save" 2>&1 | tail -5 || true

echo ""
echo "✓ Deployment completado!"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🌐 Aplicación en: https://ronaldbarrios.com/private"
echo ""
echo "Próximos pasos:"
echo "1. Esperar 30-60 segundos (arrancando Node.js)"
echo "2. Ir a: https://ronaldbarrios.com/private"
echo "3. Debería pedir login via Google (Clerk)"
echo "4. Ver logs: ssh $FTP_USER@$FTP_HOST 'pm2 logs private-office'"
echo ""
echo "Si no funciona:"
echo "1. Verificar Clerk settings en https://dashboard.clerk.com"
echo "2. Agregar ronaldbarrios.com a Allowed Origins"
echo "3. Revisar logs en Bluehost"
echo ""

# Cleanup
rm -f "$SFTP_BATCH"
rm -rf "$DEPLOY_DIR"

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
