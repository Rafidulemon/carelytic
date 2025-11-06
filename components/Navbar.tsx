"use client";

import type { Language } from "@/locales/types";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { useAuth } from "./AuthProvider";
import { useLanguage } from "./LanguageProvider";

interface NavLinkItem {
  href: string;
  labelKey: string;
}

const baseNavLinks: NavLinkItem[] = [
  { href: "/", labelKey: "common.nav.home" },
  { href: "/upload", labelKey: "common.nav.upload" },
  { href: "/about", labelKey: "common.nav.about" },
  { href: "/payment", labelKey: "common.nav.payments" },
];

const accountNavLink: NavLinkItem = { href: "/account", labelKey: "common.nav.account" };

const LANGUAGE_OPTIONS: { code: Language; labelKey: string }[] = [
  { code: "en", labelKey: "common.language.english" },
  { code: "bn", labelKey: "common.language.bengali" },
];

const linkBase =
  "relative px-4 py-2 text-sm font-semibold transition-all duration-200 text-slate-600 hover:text-slate-900";

export default function Navbar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const { t } = useLanguage();
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);

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
    const items = [...baseNavLinks];
    if (sessionUser) {
      items.push(accountNavLink);
    }
    return items.map((item) => ({
      ...item,
      label: t(item.labelKey),
    }));
  }, [sessionUser, t]);

  const creditsLabel = t("common.credits.label");
  const displayName =
    sessionUser?.name?.trim() || (sessionUser ? t("navbar.text.demoUser") : t("navbar.text.guest"));
  const signedInLabel = sessionUser ? (sessionUser.name ? t("navbar.text.signedInAs") : t("navbar.text.signedIn")) : "";

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 bg-white/95 shadow-lg backdrop-blur`}
    >
      <nav className="mx-4 flex max-w-6xl items-center justify-between px-6 py-4 sm:mx-auto lg:px-8">
        <Link href="/" className="group flex items-center gap-1" onClick={closeMenu}>
          <Image
            src="/logo/icon.png"
            alt="Carelytic logo"
            width={44}
            height={44}
            priority
          />
          <div className="flex flex-col">
            <span className="text-xl font-semibold text-slate-900 transition group-hover:text-slate-950 md:text-2xl">
              {t("common.brand")}
            </span>
          </div>
          <span className="hidden rounded-full bg-brand-gradient px-2 py-1 text-xs font-medium text-white shadow-soft md:inline">
            {t("common.beta")}
          </span>
        </Link>
        <div className="flex items-center gap-2 md:hidden">
          <LanguageToggle className="flex md:hidden" />
          <button
            type="button"
            aria-label={t("navbar.ariaMenu")}
            className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-white text-slate-600 shadow-sm transition hover:shadow"
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
        </div>
        <div className="hidden items-center gap-0 md:flex">
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
          <LanguageToggle className="hidden md:flex mx-2" />
          {sessionUser && (
            <span className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-white px-2 py-1 text-xs shadow-sm">
              <svg
                className="h-6 w-4 text-slate-500"
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
              {sessionUser.credits} {creditsLabel}
            </span>
          )}
          {sessionUser ? (
            <div className="relative ml-2">
              <button
                type="button"
                onClick={() => setProfileOpen((prev) => !prev)}
                className="cursor-pointer flex items-center gap-3 rounded-full border border-slate-200 bg-white px-3 py-2 text-left text-sm font-semibold text-slate-600 transition hover:border-slate-300 hover:text-slate-900"
              >
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-gradient text-xs font-semibold uppercase text-white shadow-soft">
                  {initials}
                </span>
                <div className="hidden text-left lg:block">
                  <p className="text-xs text-slate-400">{signedInLabel}</p>
                  <p className="text-sm font-semibold text-slate-700">{displayName}</p>
                </div>
                <svg className="h-4 w-4 text-slate-400" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M5.23 7.21a.75.75 0 011.06.02L10 11.17l3.71-3.94a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" />
                </svg>
              </button>
              {profileOpen && (
                <div className="absolute right-0 mt-3 w-56 rounded-2xl border border-slate-100 bg-white p-3 text-sm text-slate-600 shadow-xl">
                  <div className="rounded-2xl bg-slate-50/70 p-3">
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                      {t("navbar.text.recentUploads")}
                    </p>
                    <p className="mt-1 text-lg font-semibold text-slate-900">{sessionUser.history.length}</p>
                    <p className="text-xs text-slate-500">
                      {getReportsAnalyzedText(sessionUser.history.length, t)}
                    </p>
                  </div>
                  <div className="mt-3 space-y-1">
                    <Link
                      href="/account"
                      className="flex items-center justify-between rounded-xl px-3 py-2 transition hover:bg-slate-100"
                      onClick={() => setProfileOpen(false)}
                    >
                      <span>{t("common.actions.viewAccount")}</span>
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
                      <span>{t("common.actions.newUpload")}</span>
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
                    {t("common.actions.logOut")}
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
                {t("common.actions.logIn")}
              </Link>
              <Link
                href="/signup"
                className="rounded-full bg-brand-gradient px-5 py-2 text-sm font-semibold text-white shadow-soft transition-transform hover:-translate-y-0.5 hover:shadow-lg"
              >
                {t("common.actions.signUp")}
              </Link>
            </div>
          )}
        </div>
      </nav>
      {menuOpen && (
        <div className="mx-4 mb-4 flex flex-col gap-2 rounded-2xl border border-slate-100 bg-white p-4 shadow-lg md:hidden">
          <LanguageToggle className="mb-2 flex justify-center md:hidden" onChange={closeMenu} />
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
              <div className="mt-2 rounded-2xl border border-slate-100 bg-slate-50/70 p-3">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">{signedInLabel}</p>
                <p className="mt-1 text-sm font-semibold text-slate-900">{displayName}</p>
                <p className="mt-2 text-xs text-slate-500">
                  {getReportsAnalyzedText(sessionUser.history.length, t)}
                </p>
                <p className="mt-1 text-xs text-slate-500">
                  {t("navbar.text.balance")}: <span className="font-semibold text-slate-700">{sessionUser.credits}</span> {creditsLabel}
                </p>
              </div>
              <Link
                href="/account"
                onClick={closeMenu}
                className="mt-3 inline-flex items-center justify-center rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 transition hover:border-slate-300 hover:text-slate-900"
              >
                {t("common.actions.viewAccount")}
              </Link>
              <Link
                href="/upload"
                onClick={closeMenu}
                className="mt-2 inline-flex items-center justify-center rounded-full bg-brand-gradient px-4 py-2 text-sm font-semibold text-white shadow-soft transition-transform hover:-translate-y-0.5 hover:shadow-lg"
              >
                {t("common.actions.newUpload")}
              </Link>
              <button
                type="button"
                onClick={() => {
                  logout();
                  closeMenu();
                }}
                className="mt-2 inline-flex items-center justify-center rounded-full border border-slate-200 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-slate-500 transition hover:border-slate-300 hover:text-slate-900"
              >
                {t("common.actions.logOut")}
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                onClick={closeMenu}
                className="mt-2 inline-flex items-center justify-center rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 transition hover:border-slate-300 hover:text-slate-900"
              >
                {t("common.actions.logIn")}
              </Link>
              <Link
                href="/signup"
                onClick={closeMenu}
                className="mt-2 inline-flex items-center justify-center rounded-full bg-brand-gradient px-4 py-2 text-sm font-semibold text-white shadow-soft transition-transform hover:-translate-y-0.5 hover:shadow-lg"
              >
                {t("common.actions.signUp")}
              </Link>
            </>
          )}
        </div>
      )}
    </header>
  );
}

function LanguageToggle({ className, onChange }: { className?: string; onChange?: () => void }) {
  const { language, setLanguage, t } = useLanguage();

  const handleSelect = (code: Language) => {
    if (code === language) {
      return;
    }
    setLanguage(code);
    onChange?.();
  };

  return (
    <div className={className}>
      <span className="sr-only">{t("common.language.label")}</span>
      <div className="inline-flex rounded-full border border-slate-200 bg-white p-1 text-xs font-semibold shadow-sm">
        {LANGUAGE_OPTIONS.map((option) => {
          const isActive = language === option.code;
          return (
            <button
              key={option.code}
              type="button"
              onClick={() => handleSelect(option.code)}
              className={`cursor-pointer rounded-full px-3 py-1 transition ${
                isActive
                  ? "bg-brand-gradient text-white shadow-soft"
                  : "text-slate-600 hover:text-slate-900"
              }`}
              aria-pressed={isActive}
            >
              {t(option.labelKey)}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function getReportsAnalyzedText(count: number, t: (key: string, replacements?: Record<string, string | number>) => string) {
  const key = count === 1 ? "navbar.text.reportsAnalyzed.single" : "navbar.text.reportsAnalyzed.plural";
  return t(key, { count });
}
