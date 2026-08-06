# Production Readiness Checklist

Estado: **READY FOR STAGING** en Bluehost (ronaldbarrios.com/private)

## ✅ Completado

- [x] Configuración TypeScript en modo strict
- [x] Build de producción exitoso (npm run build)
- [x] Rutas API con tipos correctos (Next.js 16 Promise<params>)
- [x] Testing infrastructure (vitest + @testing-library/react)
- [x] Acceso en cascada por holdings (ADR-007)
- [x] Dark mode con localStorage persistence
- [x] Animations + prefers-reduced-motion
- [x] Mobile-responsive navbar
- [x] CSV export (entities, projects, parties, documents)
- [x] Bulk operations para tasks
- [x] OpenAPI 3.0 + Swagger UI en /api/docs
- [x] Pagination en documents/projects
- [x] Data loading scripts (Casa Amelia, Axentia, personal profile)
- [x] Database schema con Prisma 6.x
- [x] Clerk authentication integration

## 🔄 En progreso

- [ ] Deployment a Bluehost (ver DEPLOYMENT.md)
- [ ] Verificación en staging (ronaldbarrios.com/private)

## ⏳ Próximos (después de staging)

### Fase 1: Stabilize & Monitor (2-3 semanas en staging)
- [ ] Verificar load/performance en Bluehost
- [ ] Monitorear logs de errors en staging
- [ ] Testing de Clerk auth en producción
- [ ] Backup automático de BD en Render

### Fase 2: Polish Before Live
- [ ] Implementar analytics tracking
- [ ] Agregar logging/monitoring en producción
- [ ] Revisar Clerk settings para producción real
- [ ] Documentar runbook de incidents

### Fase 3: Before Go-Live
- [ ] Migración a Prisma 7 (solo si estable)
- [ ] Implementar formal migration system (ADR-001)
- [ ] CI/CD pipeline completo (GitHub Actions → Bluehost)
- [ ] Load testing / capacity planning
- [ ] Disaster recovery plan

## Comandos útiles

```bash
# Build local
cd app && npm install --include=dev && npm run build

# Test
npm test

# Deploy a Bluehost
bash scripts/deploy.sh

# Ver logs en Bluehost
pm2 logs private-office

# Health check
curl https://ronaldbarrios.com/private/api/health
```

## Variables de entorno (Bluehost)

Asegurarse de que `.env` en Bluehost tiene:
```
DATABASE_URL=postgresql://...
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
```

## URLs de referencia

- **App en staging:** https://ronaldbarrios.com/private
- **API docs:** https://ronaldbarrios.com/private/api/docs
- **Clerk dashboard:** https://dashboard.clerk.com
- **Render PostgreSQL:** dpg-d9h8ov37uimc738hb9rg-a.ohio-postgres.render.com

## Decisiones técnicas (NO cambiar sin ADR)

1. **Prisma 6.x** — No actualizar a 7 hasta que el ecosistema madure
2. **db push vs migrate dev** — Usar `db push` en desarrollo (Render no permite superuser)
3. **Node environment** — Asegurarse que `NODE_ENV=production` en Bluehost
4. **Clerk staging** — Keys de test en staging (cambiar a production antes de go-live)

---

**Última actualización:** 2026-08-06
**Responsable:** Ronald Alejandro Barrios Duarte
