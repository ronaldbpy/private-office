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
          <div className="hidden sm:flex gap-2 sm:gap-4">
            <Link
              href="/"
              className={`text-sm transition ${
                isActive("/")
                  ? "text-accent font-semibold"
                  : "text-text-secondary hover:text-text-primary"
              }`}
            >
              Home
            </Link>
            <Link
              href="/entities"
              className={`text-sm transition ${
                isActive("/entities") ||
                pathname.startsWith("/entities/")
                  ? "text-accent font-semibold"
                  : "text-text-secondary hover:text-text-primary"
              }`}
            >
              Entidades
            </Link>
            <Link
              href="/projects"
              className={`text-sm transition ${
                isActive("/projects") ||
                pathname.startsWith("/projects/")
                  ? "text-accent font-semibold"
                  : "text-text-secondary hover:text-text-primary"
              }`}
            >
              Proyectos
            </Link>
            <Link
              href="/parties"
              className={`text-sm transition ${
                isActive("/parties") ||
                pathname.startsWith("/parties/")
                  ? "text-accent font-semibold"
                  : "text-text-secondary hover:text-text-primary"
              }`}
            >
              Contactos
            </Link>
            <Link
              href="/documents"
              className={`text-sm transition ${
                isActive("/documents")
                  ? "text-accent font-semibold"
                  : "text-text-secondary hover:text-text-primary"
              }`}
            >
              Documentos
            </Link>
            <Link
              href="/intelligence"
              className={`text-sm transition ${
                isActive("/intelligence") ||
                pathname.startsWith("/intelligence/")
                  ? "text-accent font-semibold"
                  : "text-text-secondary hover:text-text-primary"
              }`}
            >
              IA
            </Link>
            <Link
              href="/holdings"
              className={`text-sm transition ${
                isActive("/holdings")
                  ? "text-accent font-semibold"
                  : "text-text-secondary hover:text-text-primary"
              }`}
            >
              Propiedad
            </Link>
          </div>
          <MobileNav />
        </div>
        <ThemeToggle />
      </div>
    </nav>
  );
}
