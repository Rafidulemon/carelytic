"use client"
import { useLanguage } from "@/components/LanguageProvider";
import Image from "next/image";
import Link from "next/link";

const footerLinks = [
  { href: "/about", labelKey: "footer.links.about" },
  { href: "/upload", labelKey: "footer.links.upload" },
  { href: "/privacy", labelKey: "footer.links.privacy" },
  { href: "mailto:rafidul.islam054@gmail.com", labelKey: "footer.links.contact" },
];

const contactDetails = [
  {
    labelKey: "footer.contact.emailLabel",
    href: "mailto:rafidul.islam054@gmail.com",
    display: "rafidul.islam054@gmail.com",
    external: false,
    icon: (
      <svg className="h-4 w-4 text-slate-300" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M3.5 5.5h13a1.5 1.5 0 011.5 1.5v6a1.5 1.5 0 01-1.5 1.5h-13A1.5 1.5 0 012 13V7a1.5 1.5 0 011.5-1.5z" />
        <path d="M4 6l6 4 6-4" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    labelKey: "footer.contact.phoneLabel",
    href: "tel:+8801990497796",
    display: "+8801990497796",
    external: false,
    icon: (
      <svg className="h-4 w-4 text-slate-300" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path
          d="M4.5 3.5h2l1.5 3.5-2 1a10.5 10.5 0 005 5l1-2 3.5 1.5v2a2 2 0 01-2.2 2 13.5 13.5 0 01-11.8-11.8 2 2 0 012-2.2z"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    labelKey: "footer.contact.websiteLabel",
    href: "https://rafidul-portfolio.vercel.app/",
    display: "rafidul-portfolio.vercel.app",
    external: true,
    icon: (
      <svg className="h-4 w-4 text-slate-300" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M10 2.5a7.5 7.5 0 017.5 7.5A7.5 7.5 0 0110 17.5 7.5 7.5 0 012.5 10 7.5 7.5 0 0110 2.5z" />
        <path d="M2.5 10h15" strokeLinecap="round" />
        <path d="M10 2.5c2.1 2.4 3.1667 4.8 3.1667 7.5S12.1 15.1 10 17.5C7.9 15.1 6.8333 12.7 6.8333 10S7.9 4.9 10 2.5z" />
      </svg>
    ),
  },
];

export default function Footer() {
  const { t, getCopy } = useLanguage();
  const highlightTags = getCopy<string[]>("footer.highlightTags");
  const teamFocusAreas = getCopy<string[]>("footer.team.focusAreas");
  return (
    <footer className="mt-20 bg-gradient-to-br from-slate-900 via-teal-950 to-slate-900 text-slate-100">
      <div className="mx-auto max-w-6xl px-6 py-12 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <Link href="/" className="flex items-center gap-3 text-slate-100 transition hover:text-white">
              <Image
                src="/logo/icon.png"
                alt="Carelytic logo"
                width={48}
                height={48}
                sizes="48px"
                className="h-14 w-12 rounded-2xl border border-white/10 bg-white/10 p-1 shadow-soft"
              />
              <div>
                <p className="text-xl font-semibold">{t("common.brand")}</p>
                <p className="text-xs font-medium uppercase tracking-wide text-slate-300">
                  {t("footer.identityTagline")}
                </p>
              </div>
            </Link>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-slate-300">{t("footer.tagline")}</p>
            <div className="mt-6 flex flex-wrap gap-2">
              {highlightTags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-slate-200"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          <div className="lg:col-span-4">
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-300">
                {t("footer.quickLinks.heading")}
              </h3>
              <ul className="mt-4 space-y-3 text-sm">
                {footerLinks.map((link) => (
                  <li key={link.labelKey}>
                    <Link
                      href={link.href}
                      className="inline-flex items-center gap-2 rounded-xl px-3 py-2 text-slate-200 transition hover:bg-white/10 hover:text-white"
                    >
                      <span className="h-2 w-2 rounded-full bg-brand-gradient" />
                      {t(link.labelKey)}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div className="mt-8">
              <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-300">
                {t("footer.contact.heading")}
              </h3>
              <ul className="mt-4 space-y-3 text-sm">
                {contactDetails.map((detail) => (
                  <li key={detail.labelKey} className="flex flex-col">
                    <span className="text-xs font-medium uppercase tracking-wide text-slate-400">
                      {t(detail.labelKey)}
                    </span>
                    <a
                      href={detail.href}
                      target={detail.external ? "_blank" : undefined}
                      rel={detail.external ? "noopener noreferrer" : undefined}
                      className="mt-1 inline-flex items-center gap-2 text-slate-200 transition hover:text-white"
                    >
                      {detail.icon}
                      {detail.display}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="lg:col-span-4">
            <div className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-xl shadow-teal-500/20 backdrop-blur">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-300">
                {t("footer.team.heading")}
              </p>
              <div className="mt-4 flex items-center gap-4">
                <Image
                  src="/new_dp.png"
                  alt={t("footer.team.name")}
                  width={84}
                  height={84}
                  sizes="84px"
                  className="h-24 w-20 rounded-2xl border border-white/20 object-cover shadow-soft"
                />
                <div>
                  <p className="text-lg font-semibold text-white">{t("footer.team.name")}</p>
                  <p className="text-sm font-medium text-slate-200">{t("footer.team.title")}</p>
                </div>
              </div>
              <p className="mt-4 text-sm leading-relaxed text-slate-200">{t("footer.team.description")}</p>
              <div className="mt-5 flex flex-wrap gap-2">
                {teamFocusAreas.map((pill) => (
                  <span
                    key={pill}
                    className="rounded-full bg-brand-gradient px-3 py-1 text-xs font-semibold uppercase tracking-wide text-white"
                  >
                    {pill}
                  </span>
                ))}
              </div>
              <Link
                href="mailto:rafidul.islam054@gmail.com"
                className="mt-6 inline-flex items-center justify-center rounded-full bg-white/10 px-4 py-2 text-sm font-semibold text-slate-100 transition hover:bg-white/20 hover:text-white"
              >
                {t("footer.team.cta")}
              </Link>
            </div>
          </div>
        </div>
        <div className="mt-10 flex flex-col gap-3 border-t border-white/10 pt-6 text-xs text-slate-400 sm:flex-row sm:items-center sm:justify-between">
          <p>{t("footer.copyright", { year: new Date().getFullYear() })}</p>
          <p className="text-slate-500">
            {t("footer.locationNote")}
          </p>
        </div>
      </div>
    </footer>
  );
}
