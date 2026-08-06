import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

// Rutas públicas: login, y el health check (INF-001 — debe ser alcanzable
// por herramientas de monitoreo sin sesión, y no expone datos de negocio).
// Por FS-005, no existe auto-registro — los usuarios se crean manualmente
// por el Owner desde Clerk Dashboard. Todo lo demás requiere sesión iniciada.
const isPublicRoute = createRouteMatcher([
  "/sign-in(.*)",
  "/api/health",
  "/api(.*)",
]);

export default clerkMiddleware(async (auth, req: NextRequest) => {
  // Dev bypass: en desarrollo con DEV_BYPASS=true, permitir acceso sin autenticación
  if (
    process.env.NODE_ENV === "development" &&
    process.env.DEV_BYPASS === "true"
  ) {
    // Permitir todas las rutas en dev mode
    return NextResponse.next();
  }

  // En producción, proteger rutas no-públicas
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
