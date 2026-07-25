import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// INF-001: health check monitoreable — pública a propósito, sin datos
// sensibles ni de negocio, solo para verificar que la app y la base están
// arriba (uptime monitors, load balancer, etc.). No confundir con un
// endpoint de datos: no requiere ni acepta autenticación.
export async function GET() {
  try {
    await prisma.$queryRaw`SELECT 1`;
    return NextResponse.json({
      status: "ok",
      db: "ok",
      time: new Date().toISOString(),
    });
  } catch {
    return NextResponse.json(
      { status: "error", db: "unreachable", time: new Date().toISOString() },
      { status: 503 },
    );
  }
}
