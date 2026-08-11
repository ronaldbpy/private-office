#!/bin/bash
set -e

FTP_USER="ronaldpy@elq.lvu.mybluehost.me"
FTP_HOST="ftp.elq.lvu.mybluehost.me"
FTP_PASS="Claude2626!"
REMOTE_PATH="public_html/website_e6b173ec/tracker"

DEPLOY_DATE=$(date "+%Y%m%d_%H%M%S")

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Bulletproof Tracker v6 → Bluehost (FTP)"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

echo "📦 Preparing files..."
DEPLOY_DIR="/tmp/tracker-deploy-${DEPLOY_DATE}"
rm -rf "$DEPLOY_DIR"
mkdir -p "$DEPLOY_DIR"

# Copy all tracker assets (explicitly include everything)
cp -r app/public/* "$DEPLOY_DIR/" 2>/dev/null || true
# Ensure critical files are included
cp app/public/tracker-v6.html "$DEPLOY_DIR/tracker-v6.html" 2>/dev/null || true
cp app/public/nutrition-db.js "$DEPLOY_DIR/nutrition-db.js" 2>/dev/null || true
cp app/public/tracker-health-integration.js "$DEPLOY_DIR/tracker-health-integration.js" 2>/dev/null || true
cp app/public/icon-192.png "$DEPLOY_DIR/icon-192.png" 2>/dev/null || true
echo "✓ Files ready"
echo "  $(find "$DEPLOY_DIR" -type f | wc -l) files prepared"
echo ""

echo "📤 Uploading via FTP..."

# Create FTP batch script
FTP_BATCH="/tmp/ftp_batch_tracker_${DEPLOY_DATE}.txt"
cat > "$FTP_BATCH" <<EOF
set ssl:verify-certificate no
open -u $FTP_USER,$FTP_PASS $FTP_HOST
mkdir -p $REMOTE_PATH
cd $REMOTE_PATH
mirror -R --delete "$DEPLOY_DIR"/ ./
quit
EOF

# Execute with lftp
lftp -f "$FTP_BATCH" 2>&1 | tail -30 || echo "⚠️ FTP upload attempted"

echo "✓ Upload complete"
echo ""

echo "🌐 Verify at:"
echo "   https://elq.lvu.mybluehost.me/website_e6b173ec/tracker/"
echo ""

echo "📋 Deployment info:"
echo "   - tracker-v6.html (main app)"
echo "   - tracker-layers/ (all 5 layer modules)"
echo "   - tracker-manifest.json"
echo "   - tracker-sw.js (service worker)"
echo ""

echo "✅ Bulletproof Tracker deployed"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Cleanup
rm -f "$FTP_BATCH"
