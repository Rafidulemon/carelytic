import { useLanguage } from "@/components/LanguageProvider";
import Link from "next/link";

const footerLinks = [
  { href: "/about", labelKey: "footer.links.about" },
  { href: "/upload", labelKey: "footer.links.upload" },
  { href: "#", labelKey: "footer.links.privacy" },
  { href: "mailto:hello@carelytic.ai", labelKey: "footer.links.contact" },
];

export default function Footer() {
  const { t } = useLanguage();
  return (
    <footer className="mt-16 border-t border-slate-200 bg-white">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-6 py-10 lg:flex-row lg:items-center lg:justify-between lg:px-8">
        <div>
          <p className="text-lg font-semibold text-slate-900">{t("common.brand")}</p>
          <p className="mt-1 text-sm text-slate-500">{t("footer.tagline")}</p>
        </div>
        <div className="flex flex-wrap gap-3 text-sm text-slate-500">
          {footerLinks.map((link) => (
            <Link
              key={link.labelKey}
              href={link.href}
              className="rounded-full px-3 py-1 transition-colors hover:text-slate-900 hover:underline"
            >
              {t(link.labelKey)}
            </Link>
          ))}
        </div>
        <p className="text-xs text-slate-400">{t("footer.copyright", { year: new Date().getFullYear() })}</p>
      </div>
    </footer>
  );
}
