#!/bin/bash

# Private Office — Automated Bluehost Deployment
# Usage: bash BLUEHOST_DEPLOY.sh <username> <bluehost_host>
# Example: bash BLUEHOST_DEPLOY.sh myuser box2638.bluehost.com

set -e

if [ "$#" -ne 2 ]; then
    echo "Usage: bash BLUEHOST_DEPLOY.sh <username> <bluehost_host>"
    echo "Example: bash BLUEHOST_DEPLOY.sh myuser box2638.bluehost.com"
    exit 1
fi

BLUEHOST_USER="$1"
BLUEHOST_HOST="$2"
BLUEHOST_PATH="public_html/website_e6b173ec"
DEPLOY_DATE=$(date "+%Y%m%d_%H%M%S")

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Private Office — Deploying to Bluehost"
echo "User: $BLUEHOST_USER | Host: $BLUEHOST_HOST | Path: $BLUEHOST_PATH"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

cd app

echo "📦 Building for production..."
npm install --include=dev
npm run build

echo ""
echo "🔄 Preparing deployment package..."
DEPLOY_DIR="/tmp/private-office-${DEPLOY_DATE}"
mkdir -p "$DEPLOY_DIR"

# Copy built files
cp -r .next "$DEPLOY_DIR/"
cp -r public "$DEPLOY_DIR/" 2>/dev/null || true
cp package.json package-lock.json "$DEPLOY_DIR/"
cp .env.production "$DEPLOY_DIR/.env" 2>/dev/null || echo "⚠️  .env.production not found"
cp prisma/schema.prisma "$DEPLOY_DIR/" 2>/dev/null || true

echo "✓ Files prepared at: $DEPLOY_DIR"
echo ""

# Detect if we're using password or SSH key
echo "🔐 Connecting to Bluehost..."

# Test connection
if ssh -o ConnectTimeout=5 "${BLUEHOST_USER}@${BLUEHOST_HOST}" "echo 'Connected!'" 2>/dev/null; then
    echo "✓ SSH connection successful"

    echo ""
    echo "📤 Uploading to Bluehost..."

    # Backup current deployment (if exists)
    ssh "${BLUEHOST_USER}@${BLUEHOST_HOST}" "cd ~/${BLUEHOST_PATH} && [ -d .next ] && mv .next .next.backup.${DEPLOY_DATE} || true" 2>/dev/null || true

    # Upload new files
    scp -r "$DEPLOY_DIR/.next" "${BLUEHOST_USER}@${BLUEHOST_HOST}:~/${BLUEHOST_PATH}/.next"
    scp -r "$DEPLOY_DIR/public" "${BLUEHOST_USER}@${BLUEHOST_HOST}:~/${BLUEHOST_PATH}/public" 2>/dev/null || true
    scp "$DEPLOY_DIR/package.json" "${BLUEHOST_USER}@${BLUEHOST_HOST}:~/${BLUEHOST_PATH}/package.json"
    scp "$DEPLOY_DIR/.env" "${BLUEHOST_USER}@${BLUEHOST_HOST}:~/${BLUEHOST_PATH}/.env" 2>/dev/null || true

    echo "✓ Files uploaded"
    echo ""

    echo "⚙️  Installing dependencies on Bluehost..."
    ssh "${BLUEHOST_USER}@${BLUEHOST_HOST}" "cd ~/${BLUEHOST_PATH} && npm install --omit=dev 2>&1 | tail -5"

    echo ""
    echo "🚀 Starting application..."
    ssh "${BLUEHOST_USER}@${BLUEHOST_HOST}" "cd ~/${BLUEHOST_PATH} && pm2 stop private-office 2>/dev/null || true && pm2 start 'npm start' --name 'private-office' && pm2 save"

    echo ""
    echo "✓ Deployment complete!"
    echo ""
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo "📍 Application running at: https://${BLUEHOST_HOST}/${BLUEHOST_PATH}"
    echo ""
    echo "Next steps:"
    echo "1. Verify Clerk config at: https://dashboard.clerk.com"
    echo "2. Add ronaldbarrios.com to Clerk allowed origins"
    echo "3. Check logs: ssh ${BLUEHOST_USER}@${BLUEHOST_HOST} 'pm2 logs private-office'"
    echo ""

else
    echo "❌ SSH connection failed"
    echo ""
    echo "Manual deployment steps:"
    echo "1. Upload $DEPLOY_DIR to Bluehost via cPanel File Manager or SFTP"
    echo "2. SSH into Bluehost:"
    echo "   ssh ${BLUEHOST_USER}@${BLUEHOST_HOST}"
    echo "3. Navigate and install:"
    echo "   cd ~/${BLUEHOST_PATH}"
    echo "   npm install --omit=dev"
    echo "4. Start application:"
    echo "   pm2 start 'npm start' --name 'private-office'"
    exit 1
fi

# Cleanup
rm -rf "$DEPLOY_DIR"

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
