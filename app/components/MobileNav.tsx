"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function MobileNav() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const isActive = (path: string) => pathname === path;

  const links = [
    { href: "/", label: "Home" },
    { href: "/entities", label: "Entidades" },
    { href: "/projects", label: "Proyectos" },
    { href: "/parties", label: "Contactos" },
    { href: "/documents", label: "Documentos" },
    { href: "/intelligence", label: "IA" },
    { href: "/holdings", label: "Propiedad" },
  ];

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="sm:hidden p-2 -mr-2"
        aria-label="Toggle menu"
        aria-expanded={isOpen}
      >
        ☰
      </button>

      {isOpen && (
        <div className="sm:hidden absolute left-0 right-0 top-full bg-surface-1 border-b border-border-soft z-40">
          <div className="flex flex-col py-2">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`px-5 py-2 text-sm transition ${
                  isActive(link.href) || pathname.startsWith(link.href + "/")
                    ? "text-accent font-semibold bg-surface-2"
                    : "text-text-secondary hover:text-text-primary"
                }`}
                onClick={() => setIsOpen(false)}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
