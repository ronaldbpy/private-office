import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

// Rutas públicas: login, y el health check (INF-001 — debe ser alcanzable
// por herramientas de monitoreo sin sesión, y no expone datos de negocio).
// Por FS-005, no existe auto-registro — los usuarios se crean manualmente
// por el Owner desde Clerk Dashboard. Todo lo demás requiere sesión iniciada.
const isPublicRoute = createRouteMatcher([
  "/sign-in(.*)",
  "/api/health",
]);

export default clerkMiddleware(async (auth, req) => {
  if (!isPublicRoute(req)) {
    await auth.protect();
  }
});

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
