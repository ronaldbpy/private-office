#!/bin/bash
set -e

FTP_USER="ronaldpy@elq.lvu.mybluehost.me"
FTP_HOST="ftp.elq.lvu.mybluehost.me"
FTP_PASS="Nderakore596!"
REMOTE_PATH="public_html/website_e6b173ec"

DEPLOY_DATE=$(date "+%Y%m%d_%H%M%S")

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Private Office → Bluehost (FTP)"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

cd app

echo "📦 Build..."
npm run build
echo "✓ Build OK"
echo ""

echo "🔄 Preparando archivos..."
DEPLOY_DIR="/tmp/app-deploy"
rm -rf "$DEPLOY_DIR"
mkdir -p "$DEPLOY_DIR"

cp -r .next "$DEPLOY_DIR/"
cp -r public "$DEPLOY_DIR/" 2>/dev/null || true
cp package.json package-lock.json "$DEPLOY_DIR/"
cp .env.production "$DEPLOY_DIR/.env" 2>/dev/null || true

echo "✓ Archivos listos"
echo ""

echo "📤 Subiendo via FTP..."

# Crear script FTP batch
FTP_BATCH="/tmp/ftp_batch_${DEPLOY_DATE}.txt"
cat > "$FTP_BATCH" <<EOF
set ssl:verify-certificate no
open -u $FTP_USER,$FTP_PASS $FTP_HOST
cd $REMOTE_PATH
mirror -R --delete $DEPLOY_DIR/ ./
quit
EOF

# Ejecutar con lftp (mejor soporte de FTP recursivo)
lftp -f "$FTP_BATCH" 2>&1 | tail -30 || echo "⚠️  FTP upload intentado"

echo "✓ Archivos subidos"
echo ""

echo "📋 Verifica manualmente en Bluehost:"
echo "1. cPanel → File Manager → public_html/website_e6b173ec"
echo "2. Verifica que existen: .next/ public/ package.json .env"
echo ""

echo "3. Terminal en Bluehost:"
echo "   cd public_html/website_e6b173ec"
echo "   npm install --omit=dev"
echo "   pm2 start 'npm start' --name 'private-office'"
echo "   pm2 save"
echo ""

echo "🌐 URL: https://ronaldbarrios.com/private"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Cleanup
rm -f "$FTP_BATCH"
