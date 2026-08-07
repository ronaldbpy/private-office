"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ThemeToggle } from "./ThemeToggle";
import { MobileNav } from "./MobileNav";

export function Navbar() {
  const pathname = usePathname();

  const isActive = (path: string) => pathname === path;

  return (
    <nav className="sticky top-0 z-50 border-b border-border-soft bg-surface-1" aria-label="Main navigation">
      <div className="flex items-center justify-between px-5 py-3 relative">
        <div className="flex items-center gap-4 sm:gap-6">
          <Link href="/" className="text-lg font-bold" aria-label="Private Office Home">
            Private Office
          </Link>
          <div className="hidden sm:flex gap-2 sm:gap-4 flex-wrap text-xs sm:text-sm">
            <Link href="/" className={`transition ${isActive("/") ? "text-accent font-semibold" : "text-text-secondary hover:text-text-primary"}`}>Home</Link>
            <Link href="/entities" className={`transition ${isActive("/entities") || pathname.startsWith("/entities/") ? "text-accent font-semibold" : "text-text-secondary hover:text-text-primary"}`}>Entidades</Link>
            <Link href="/customers" className={`transition ${isActive("/customers") || pathname.startsWith("/customers/") ? "text-accent font-semibold" : "text-text-secondary hover:text-text-primary"}`}>Clientes</Link>
            <Link href="/products" className={`transition ${isActive("/products") || pathname.startsWith("/products/") ? "text-accent font-semibold" : "text-text-secondary hover:text-text-primary"}`}>Productos</Link>
            <Link href="/suppliers" className={`transition ${isActive("/suppliers") || pathname.startsWith("/suppliers/") ? "text-accent font-semibold" : "text-text-secondary hover:text-text-primary"}`}>Proveedores</Link>
            <Link href="/quotes" className={`transition ${isActive("/quotes") || pathname.startsWith("/quotes/") ? "text-accent font-semibold" : "text-text-secondary hover:text-text-primary"}`}>Cotizaciones</Link>
            <Link href="/invoices" className={`transition ${isActive("/invoices") || pathname.startsWith("/invoices/") ? "text-accent font-semibold" : "text-text-secondary hover:text-text-primary"}`}>Facturas</Link>
            <Link href="/inventory" className={`transition ${isActive("/inventory") || pathname.startsWith("/inventory/") ? "text-accent font-semibold" : "text-text-secondary hover:text-text-primary"}`}>Inventario</Link>
            <Link href="/events" className={`transition ${isActive("/events") || pathname.startsWith("/events/") ? "text-accent font-semibold" : "text-text-secondary hover:text-text-primary"}`}>Eventos</Link>
            <Link href="/projects" className={`transition ${isActive("/projects") || pathname.startsWith("/projects/") ? "text-accent font-semibold" : "text-text-secondary hover:text-text-primary"}`}>Proyectos</Link>
            <Link href="/parties" className={`transition ${isActive("/parties") || pathname.startsWith("/parties/") ? "text-accent font-semibold" : "text-text-secondary hover:text-text-primary"}`}>Contactos</Link>
            <Link href="/documents" className={`transition ${isActive("/documents") ? "text-accent font-semibold" : "text-text-secondary hover:text-text-primary"}`}>Docs</Link>
            <Link href="/holdings" className={`transition ${isActive("/holdings") ? "text-accent font-semibold" : "text-text-secondary hover:text-text-primary"}`}>Propiedad</Link>
          </div>
          <MobileNav />
        </div>
        <ThemeToggle />
      </div>
    </nav>
  );
}
