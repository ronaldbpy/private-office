# Render Environment Setup — MANUAL STEPS REQUIRED

**Status:** DATABASE_URL y Clerk keys no están siendo leídos en Render deployment.

## Root Cause

`render.yaml` puede ser sobrescrito por Render dashboard. Environment variables deben ser configuradas manualmente en:
**Render Dashboard → private-office service → Environment**

## Required Environment Variables

Add these manually in Render dashboard:

```
NODE_ENV=production

DATABASE_URL=postgresql://private_office_db_user:knAUXd4nIndbfxpi8VbAtyQm1GXVg5fE@dpg-d9h8ov37uimc738hb9rg-a.ohio-postgres.render.com/private_office_db

NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_cHJlY2lvdXMtZmluY2gtMC5jbGVyay5hY2NvdW50cy5kZXYk

CLERK_SECRET_KEY=sk_test_JCEnIarjE62RAWn7TvgSeSPeUqHf9qZOiIrS2IHNX7

NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in

NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
```

## Steps

1. Go to https://dashboard.render.com
2. Select "private-office" service
3. Click "Environment"
4. Add each key-value pair above
5. Click "Save" (auto-redeploy starts)
6. Wait ~5 min for deploy to complete
7. Test `/api/health` — should return `{"status":"ok","db":"ok",...}`

## Verification

Once deployed:
```bash
curl https://private-office-wq4y.onrender.com/api/health
# Expected: {"status":"ok","db":"ok","time":"..."}
```

Then test login:
```
1. Visit https://private-office-wq4y.onrender.com
2. Should redirect to /sign-in
3. Click "Sign in with Google"
4. Authenticate
5. Dashboard should load with test data (3 companies, 6 customers, 9 products)
```

## Alternative: Use render.yaml Only

If dashboard variables are unreliable, migrate to using only `render.yaml` with explicit `value:` fields (already done in commit d81c5cd).
