"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { useAuth } from "./AuthProvider";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/upload", label: "Upload" },
  { href: "/about", label: "About" },
  { href: "/payment", label: "Payments" },
];

const linkBase =
  "relative px-4 py-2 text-sm font-semibold transition-all duration-200 text-slate-600 hover:text-slate-900";

export default function Navbar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const [isScrolled, setIsScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 8);
    handleScroll();
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }
    const frame = window.requestAnimationFrame(() => setIsHydrated(true));
    return () => window.cancelAnimationFrame(frame);
  }, []);

  const sessionUser = isHydrated ? user : null;

  const closeMenu = () => setMenuOpen(false);

  const initials = useMemo(() => {
    if (!sessionUser) return "";
    if (sessionUser.name) {
      return sessionUser.name
        .split(" ")
        .filter(Boolean)
        .map((part) => part[0]?.toUpperCase())
        .join("")
        .slice(0, 2);
    }
    return sessionUser.phone.slice(-4);
  }, [sessionUser]);

  const links = useMemo(() => {
    if (!sessionUser) return navLinks;
    return [...navLinks, { href: "/account", label: "Account" }];
  }, [sessionUser]);

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
        <div className="hidden items-center gap-3 md:flex">
          {links.map((link) => {
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
          {sessionUser && (
            <span className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-600">
              <svg
                className="h-3.5 w-3.5 text-slate-500"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M12 3v18" />
                <path d="M8 5h8a3 3 0 013 3v8a3 3 0 01-3 3H8a3 3 0 01-3-3V8a3 3 0 013-3z" />
              </svg>
              {sessionUser.credits} credits
            </span>
          )}
          {sessionUser ? (
            <div className="relative ml-2">
              <button
                type="button"
                onClick={() => setProfileOpen((prev) => !prev)}
                className="flex items-center gap-3 rounded-full border border-slate-200 bg-white px-3 py-2 text-left text-sm font-semibold text-slate-600 transition hover:border-slate-300 hover:text-slate-900"
              >
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-gradient text-xs font-semibold uppercase text-white shadow-soft">
                  {initials}
                </span>
                <div className="hidden text-left lg:block">
                  <p className="text-xs text-slate-400">Signed in</p>
                  <p className="text-sm font-semibold text-slate-700">
                    {sessionUser.name ?? `+${sessionUser.phone}`}
                  </p>
                </div>
                <svg
                  className="h-4 w-4 text-slate-400"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path d="M5.23 7.21a.75.75 0 011.06.02L10 11.17l3.71-3.94a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" />
                </svg>
              </button>
              {profileOpen && (
                <div className="absolute right-0 mt-3 w-56 rounded-2xl border border-slate-100 bg-white p-3 text-sm text-slate-600 shadow-xl">
                  <div className="rounded-2xl bg-slate-50/70 p-3">
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                      Recent uploads
                    </p>
                    <p className="mt-1 text-lg font-semibold text-slate-900">
                      {sessionUser.history.length}
                    </p>
                    <p className="text-xs text-slate-500">reports analyzed</p>
                  </div>
                  <div className="mt-3 space-y-1">
                    <Link
                      href="/account"
                      className="flex items-center justify-between rounded-xl px-3 py-2 transition hover:bg-slate-100"
                      onClick={() => setProfileOpen(false)}
                    >
                      <span>Account</span>
                      <svg className="h-3.5 w-3.5" viewBox="0 0 16 16" fill="none">
                        <path
                          d="M5.5 3.5L10 8l-4.5 4.5"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </Link>
                    <Link
                      href="/upload"
                      className="flex items-center justify-between rounded-xl px-3 py-2 transition hover:bg-slate-100"
                      onClick={() => setProfileOpen(false)}
                    >
                      <span>New upload</span>
                      <svg className="h-3.5 w-3.5" viewBox="0 0 16 16" fill="none">
                        <path
                          d="M8 3.333v9.334"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                        />
                        <path
                          d="M3.333 8h9.334"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                        />
                      </svg>
                    </Link>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      logout();
                      setProfileOpen(false);
                    }}
                    className="mt-3 w-full rounded-full border border-slate-200 px-3 py-2 text-xs font-semibold uppercase tracking-wide text-slate-500 transition hover:border-slate-300 hover:text-slate-900"
                  >
                    Log out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="ml-4 flex items-center gap-2">
              <Link
                href="/login"
                className="rounded-full border border-slate-200 px-5 py-2 text-sm font-semibold text-slate-600 transition hover:border-slate-300 hover:text-slate-900"
              >
                Log in
              </Link>
              <Link
                href="/signup"
                className="rounded-full bg-brand-gradient px-5 py-2 text-sm font-semibold text-white shadow-soft transition-transform hover:-translate-y-0.5 hover:shadow-lg"
              >
                Sign up
              </Link>
            </div>
          )}
        </div>
      </nav>
      {menuOpen && (
        <div className="mx-4 mb-4 flex flex-col gap-1 rounded-2xl border border-slate-100 bg-white p-4 shadow-lg md:hidden">
          {links.map((link) => {
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
          {sessionUser ? (
            <>
              <div className="mt-3 rounded-2xl border border-slate-100 bg-slate-50/70 p-3">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                  Signed in as
                </p>
                <p className="mt-1 text-sm font-semibold text-slate-900">
                  {sessionUser.name ?? `+${sessionUser.phone}`}
                </p>
                <p className="mt-2 text-xs text-slate-500">
                  {sessionUser.history.length} report{sessionUser.history.length === 1 ? "" : "s"} analyzed
                </p>
                <p className="mt-1 text-xs text-slate-500">
                  Balance: <span className="font-semibold text-slate-700">{sessionUser.credits}</span> credits
                </p>
              </div>
              <Link
                href="/account"
                onClick={closeMenu}
                className="mt-3 inline-flex items-center justify-center rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 transition hover:border-slate-300 hover:text-slate-900"
              >
                View account
              </Link>
              <Link
                href="/upload"
                onClick={closeMenu}
                className="mt-2 inline-flex items-center justify-center rounded-full bg-brand-gradient px-4 py-2 text-sm font-semibold text-white shadow-soft transition-transform hover:-translate-y-0.5 hover:shadow-lg"
              >
                New upload
              </Link>
              <button
                type="button"
                onClick={() => {
                  logout();
                  closeMenu();
                }}
                className="mt-2 inline-flex items-center justify-center rounded-full border border-slate-200 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-slate-500 transition hover:border-slate-300 hover:text-slate-900"
              >
                Log out
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                onClick={closeMenu}
                className="mt-2 inline-flex items-center justify-center rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 transition hover:border-slate-300 hover:text-slate-900"
              >
                Log in
              </Link>
              <Link
                href="/signup"
                onClick={closeMenu}
                className="mt-2 inline-flex items-center justify-center rounded-full bg-brand-gradient px-4 py-2 text-sm font-semibold text-white shadow-soft transition-transform hover:-translate-y-0.5 hover:shadow-lg"
              >
                Sign up
              </Link>
            </>
          )}
        </div>
      )}
    </header>
  );
}
