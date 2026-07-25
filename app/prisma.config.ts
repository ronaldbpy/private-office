import "dotenv/config";
import { defineConfig } from "prisma/config";

// Migrado desde package.json#prisma (deprecado en Prisma 7) por indicación
// del propio warning que aparecía en cada comando `prisma db push`/`seed`.
// El formato nuevo NO carga .env automáticamente (a diferencia del viejo) —
// hay que hacerlo explícito acá arriba, si no falla DATABASE_URL.
export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    seed: "tsx prisma/seed.ts",
  },
});
