"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function Navbar() {
  const pathname = usePathname();

  const isActive = (path: string) => pathname === path;

  return (
    <nav className="sticky top-0 z-50 border-b border-border-soft bg-bg-primary">
      <div className="flex items-center justify-between px-5 py-3">
        <div className="flex items-center gap-6">
          <Link href="/" className="text-lg font-bold">
            Private Office
          </Link>
          <div className="flex gap-4">
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
          </div>
        </div>
      </div>
    </nav>
  );
}
