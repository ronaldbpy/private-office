# Tracker v5.2 — Deployment Instructions

**Version:** v5.2 (2026-08-07)  
**Status:** Ready for FTP upload  
**Files location:** `app/public/`

## What's New in v5.2

✅ **Supplements tracking** — New tab 💊 with:
- Protein powder (grams)
- Creatine (mg)
- Pre-workout (dose/notes)
- Vitamins (list)

✅ **40 meal presets** — Spanish common meals with exact macros:
- Pechuga pollo (100g): P:31g C:0 F:3.6
- Salmón (100g): P:25g C:0 F:13
- Arroz blanco (100g): P:2.7g C:28 F:0.3
- ... y 37 más

✅ **Auto-fill** — Dropdown selector fills macros instantly

✅ **Historial enhanced** — Shows supp intake: P=protein, C=creatine, X=pre-workout

## Files Ready to Upload

```
app/public/tracker.html              (30 KB) — Main app
app/public/tracker-manifest.json     (757 B) — PWA manifest
app/public/tracker-sw.js             (1.1 KB) — Service Worker v3
app/public/icon-192.png              (3.1 KB) — PWA icon
app/public/icon-512.png              (8.7 KB) — PWA icon
```

**Total:** ~44 KB

## Upload via FTP (Any FTP Client)

### Method 1: Command Line (lftp)
```bash
lftp -u ronaldpy@elq.lvu.mybluehost.me,PASSWORD ftp.elq.lvu.mybluehost.me
cd public_html/tracker
put app/public/tracker.html index.html
put app/public/tracker-manifest.json
put app/public/tracker-sw.js
put app/public/icon-192.png
put app/public/icon-512.png
quit
```

### Method 2: GUI FTP Client (Cyberduck, FileZilla)
1. **Host:** ftp.elq.lvu.mybluehost.me
2. **User:** ronaldpy@elq.lvu.mybluehost.me
3. **Password:** [Use Bluehost password]
4. **Path:** public_html/tracker/
5. **Files to upload:**
   - `tracker.html` → rename to `index.html` on server
   - `tracker-manifest.json`
   - `tracker-sw.js`
   - `icon-192.png`
   - `icon-512.png`

### Method 3: cPanel File Manager
1. Login to cPanel: https://elq.lvu.mybluehost.me/cpanel
2. File Manager
3. Navigate to: `/public_html/tracker/`
4. Upload 5 files from `app/public/`
5. Rename `tracker.html` to `index.html` if needed

## Verification After Upload

After uploading, verify at: https://ronaldbarrios.com/tracker/

**Test checklist:**
- [ ] Dashboard loads with stats
- [ ] 🍽️ Meals tab shows 40 presets in dropdown
- [ ] Select meal preset, macros auto-fill
- [ ] 💪 Workouts tab functional
- [ ] 💧 Hydration tab stores liters
- [ ] 😴 Recovery tab saves weight
- [ ] 💊 Supplements tab has protein/creatine/pre-workout fields
- [ ] 💉 Peptides tab loads with all compounds
- [ ] 📊 Historial shows last 60 days + supp indicators (P/C/X)
- [ ] 📁 Datos tab: Export/Import JSON working
- [ ] ☀️ Dark mode toggle functional

## Data Persistence

- **Storage:** localStorage (device-specific, survives offline)
- **Export:** Use "📁 Datos → Exportar histórico (JSON)"
- **Multi-device:** Export on one device, import on another
- **Backup:** Automatic localStorage backup in `_prev` key before each save

## Git Status

**Latest commit:**
```
c9a8fde feat: tracker v5.2 - add supplements tracking + 40 meal presets
```

**Branch:** `main` (pushed to https://github.com/ronaldbpy/private-office)

## Troubleshooting

| Issue | Fix |
|-------|-----|
| Page won't load | Clear browser cache, hard refresh (Ctrl+F5 / Cmd+Shift+R) |
| No data appears | Check localStorage: Browser DevTools → Application → Local Storage → rb_tracker_v5 |
| Meal presets not showing | Reload page after upload (browser may cache old version) |
| Service Worker error | Ignore if page loads. SW caches in background. |
| FTP upload fails | Verify host/user/pass. Try SFTP if FTP unavailable. |

## What NOT to do

❌ Don't manually edit tracker.html in cPanel (sync issues)  
❌ Don't delete `icon-*.png` (PWA icons required)  
❌ Don't overwrite without backup (old version kept as `-prev`)  
❌ Don't change localStorage keys manually (schema mismatch)

## Next: Backend Sync (Optional Future)

If you want to sync across devices automatically:
- Requires backend PHP (currently huérfano)
- Requires setup of `tracker_data/` folder on server
- Requires implementation of sync.php to handle records
- Currently not needed: Export/Import JSON covers multi-device

