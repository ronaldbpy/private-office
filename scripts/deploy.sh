#!/bin/bash
set -e

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Private Office — Deployment to Bluehost (ronaldbarrios.com/private)"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# 1. Verificar que estamos en el directorio correcto
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json no encontrado. Ejecuta este script desde app/"
    exit 1
fi

echo "✓ Verificando entorno..."

# 2. Verificar que no hay cambios sin commitear
if ! git diff-index --quiet HEAD --; then
    echo "⚠️  Hay cambios sin stagear. Considera commitear primero."
    echo ""
    git status --short
    read -p "¿Continuar con el deployment? (y/n) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo "❌ Deployment cancelado."
        exit 1
    fi
fi

# 3. Instalar dependencias (incluidas devDependencies para build)
echo ""
echo "📦 Instalando dependencias..."
npm install --include=dev

# 4. Compilar para producción
echo ""
echo "🔨 Compilando para producción..."
npm run build

# 5. Crear archivo de versión/timestamp
BUILD_TIME=$(date -u "+%Y-%m-%d %H:%M:%S UTC")
GIT_COMMIT=$(git rev-parse --short HEAD 2>/dev/null || echo "unknown")
echo "{\"buildTime\": \"$BUILD_TIME\", \"gitCommit\": \"$GIT_COMMIT\"}" > .next/build-info.json

# 6. Crear empaquetamiento para deployment
DEPLOY_DIR="/tmp/private-office-deploy-$(date +%s)"
mkdir -p "$DEPLOY_DIR"

echo ""
echo "📂 Preparando archivos para deployment..."
# Copiar archivos necesarios (no incluir node_modules, vamos a instalar en prod)
cp -r .next "$DEPLOY_DIR/"
cp -r public "$DEPLOY_DIR/" 2>/dev/null || true
cp package.json package-lock.json "$DEPLOY_DIR/"
cp .env.production "$DEPLOY_DIR/.env" 2>/dev/null || echo "⚠️  No se encontró .env.production"

echo "✓ Archivos preparados en: $DEPLOY_DIR"
echo ""

# 7. Instrucciones para upload
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📋 PRÓXIMO PASO: Upload a Bluehost"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "1. Accede a Bluehost cPanel SSH:"
echo "   ssh tu-usuario@ronaldbarrios.com"
echo ""
echo "2. Navega al directorio web:"
echo "   cd public_html/private"
echo ""
echo "3. Descarga los archivos desde tu máquina (ejecuta desde tu terminal local):"
echo "   # Este comando copia el directorio .next y archivos de config"
echo "   # (Bluehost debe estar configurado para Node.js)"
echo ""
echo "4. Archivos en: $DEPLOY_DIR"
echo ""
echo "5. Reinicia la aplicación Node en Bluehost si es necesario"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✓ Build completado y listo para deployment"
echo ""
