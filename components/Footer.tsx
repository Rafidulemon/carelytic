import Link from "next/link";

const footerLinks = [
  { href: "/about", label: "About" },
  { href: "/upload", label: "Upload" },
  { href: "#", label: "Privacy Policy" },
  { href: "mailto:hello@carelytic.ai", label: "Contact" },
];

export default function Footer() {
  return (
    <footer className="mt-16 border-t border-slate-200 bg-white">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-6 py-10 lg:flex-row lg:items-center lg:justify-between lg:px-8">
        <div>
          <p className="text-lg font-semibold text-slate-900">Carelytic</p>
          <p className="mt-1 text-sm text-slate-500">
            AI that understands your medical language and translates it into clarity.
          </p>
        </div>
        <div className="flex flex-wrap gap-3 text-sm text-slate-500">
          {footerLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="rounded-full px-3 py-1 transition-colors hover:text-slate-900 hover:underline"
            >
              {link.label}
            </Link>
          ))}
        </div>
        <p className="text-xs text-slate-400">
          © {new Date().getFullYear()} Carelytic. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
