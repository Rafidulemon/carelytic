"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/upload", label: "Upload" },
  { href: "/about", label: "About" },
];

const linkBase =
  "relative px-4 py-2 text-sm font-semibold transition-all duration-200 text-slate-600 hover:text-slate-900";

export default function Navbar() {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 8);
    handleScroll();
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const closeMenu = () => setMenuOpen(false);

  return (
    <header
      className={`sticky top-0 z-50 transition-shadow duration-300 ${
        isScrolled ? "shadow-lg bg-white/95 backdrop-blur" : "bg-white/80 backdrop-blur"
      }`}
    >
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4 lg:px-8">
        <Link href="/" className="flex items-center gap-2" onClick={closeMenu}>
          <span className="text-2xl font-semibold text-slate-900">Carelytic</span>
          <span className="hidden rounded-full bg-brand-gradient px-2 py-1 text-xs font-medium text-white md:inline">
            Beta
          </span>
        </Link>
        <button
          type="button"
          aria-label="Toggle navigation"
          className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-white text-slate-600 shadow-sm transition hover:shadow md:hidden"
          onClick={() => setMenuOpen((prev) => !prev)}
        >
          <svg
            className="h-5 w-5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            {menuOpen ? (
              <path d="M6 18L18 6M6 6l12 12" />
            ) : (
              <>
                <path d="M4 6h16" />
                <path d="M4 12h16" />
                <path d="M4 18h16" />
              </>
            )}
          </svg>
        </button>
        <div className="hidden items-center gap-2 md:flex">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`${linkBase} ${
                  isActive
                    ? "text-slate-900"
                    : "after:absolute after:inset-x-2 after:-bottom-1 after:h-0.5 after:scale-x-0 after:rounded-full after:bg-brand-gradient after:transition-transform after:duration-300 hover:after:scale-x-100"
                }`}
              >
                {link.label}
                {isActive && (
                  <span className="absolute inset-x-3 -bottom-[6px] h-0.5 rounded-full bg-brand-gradient" />
                )}
              </Link>
            );
          })}
          <Link
            href="/upload"
            className="ml-4 rounded-full bg-brand-gradient px-5 py-2 text-sm font-semibold text-white shadow-soft transition-transform hover:-translate-y-0.5 hover:shadow-lg lg:inline-flex"
          >
            Get Started
          </Link>
        </div>
      </nav>
      {menuOpen && (
        <div className="mx-4 mb-4 flex flex-col gap-1 rounded-2xl border border-slate-100 bg-white p-4 shadow-lg md:hidden">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={closeMenu}
                className={`rounded-xl px-3 py-2 text-sm font-semibold transition-colors ${
                  isActive
                    ? "bg-brand-gradient-soft text-slate-900"
                    : "text-slate-600 hover:bg-slate-100"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
          <Link
            href="/upload"
            onClick={closeMenu}
            className="mt-2 inline-flex items-center justify-center rounded-full bg-brand-gradient px-4 py-2 text-sm font-semibold text-white shadow-soft transition-transform hover:-translate-y-0.5 hover:shadow-lg"
          >
            Get Started
          </Link>
        </div>
      )}
    </header>
  );
}
