"use client"
import FeatureCard from "@/components/FeatureCard";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { useLanguage } from "@/components/LanguageProvider";
import Link from "next/link";

interface HomeCopy {
  hero: {
    badge: string;
    titleLead: string;
    titleHighlight: string;
    description: string;
    primaryCta: string;
    secondaryCta: string;
    metrics: { label: string; value: string; suffix: string }[];
  };
  previewCard: {
    latestReportLabel: string;
    latestReportName: string;
    status: string;
    insightBadge: string;
    insightCopy: string;
    itemReady: string;
  };
  featuresSection: {
    label: string;
    heading: string;
    description: string;
    items: { title: string; description: string }[];
  };
  doctorsSection: {
    label: string;
    heading: string;
    description: string;
    quotes: { name: string; role: string; quote: string }[];
  };
}

const featureIcons = [
  (
    <svg
      key="upload"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-6 w-6"
    >
      <path d="M12 21v-9" />
      <path d="M7 13l5-5 5 5" />
      <rect x="4" y="3" width="16" height="4" rx="1.5" />
      <path d="M8 21h8" />
    </svg>
  ),
  (
    <svg
      key="interpret"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-6 w-6"
    >
      <path d="M12 5v14" />
      <path d="M5 12h14" />
      <path d="M9 9h.01" />
      <path d="M15 15h.01" />
      <path d="M21 3l-3 3" />
      <path d="M3 3l3 3" />
      <path d="M21 21l-3-3" />
      <path d="M3 21l3-3" />
    </svg>
  ),
  (
    <svg
      key="insights"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-6 w-6"
    >
      <path d="M4 19V5" />
      <path d="M20 19V9" />
      <path d="M12 19V3" />
      <path d="M4 15l4-4 4 4 4-6 4 4" />
    </svg>
  ),
];

export default function HomePage() {
  const { getCopy } = useLanguage();
  const home = getCopy<HomeCopy>("home");
  const { hero, previewCard, featuresSection, doctorsSection } = home;

  return (
    <div className="min-h-screen bg-slate-50/80">
      <Navbar />
      <main className="relative overflow-hidden">
        <div className="absolute left-1/2 top-24 h-64 w-64 -translate-x-1/2 rounded-full bg-brand-gradient opacity-20 blur-3xl" />
        <section className="mx-auto flex max-w-6xl flex-col items-center gap-12 px-6 pb-16 pt-20 text-center lg:flex-row lg:items-center lg:text-left lg:pt-24 xl:px-8">
          <div className="max-w-xl space-y-6">
            <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-1 text-xs font-semibold uppercase tracking-wide text-slate-600 shadow-sm">
              {hero.badge}
            </span>
            <h1 className="text-4xl font-bold leading-tight text-slate-900 sm:text-5xl">
              {hero.titleLead} <span className="text-gradient">{hero.titleHighlight}</span>
            </h1>
            <p className="text-base leading-relaxed text-slate-600 sm:text-lg">{hero.description}</p>
            <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-center sm:justify-start">
              <Link
                href="/upload"
                className="inline-flex items-center justify-center rounded-full bg-brand-gradient px-6 py-3 text-sm font-semibold text-white shadow-soft transition-transform hover:-translate-y-0.5 hover:shadow-lg"
              >
                {hero.primaryCta}
              </Link>
              <Link
                href="/about"
                className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-600 transition hover:border-slate-300 hover:text-slate-900"
              >
                {hero.secondaryCta}
              </Link>
            </div>
            <div className="grid gap-4 text-left sm:grid-cols-2">
              {hero.metrics.map((metric) => (
                <div
                  key={metric.label}
                  className="rounded-3xl border border-slate-100 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
                >
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{metric.label}</p>
                  <p className="mt-1 text-2xl font-semibold text-slate-900">
                    {metric.value} <span className="text-base font-medium text-slate-500">{metric.suffix}</span>
                  </p>
                </div>
              ))}
            </div>
          </div>
          <div className="relative w-full max-w-md">
            <div className="relative overflow-hidden rounded-3xl border border-slate-100 bg-white/90 p-6 shadow-xl backdrop-blur">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-slate-500">{previewCard.latestReportLabel}</p>
                  <h2 className="text-xl font-semibold text-slate-900">{previewCard.latestReportName}</h2>
                </div>
                <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-600">
                  {previewCard.status}
                </span>
              </div>
              <div className="mt-6 space-y-3">
                {featuresSection.items.map((feature, index) => (
                  <div
                    key={feature.title}
                    className="flex items-center justify-between rounded-2xl bg-slate-50/70 p-3 text-left transition hover:bg-white"
                  >
                    <span className="text-sm font-semibold text-slate-600">{feature.title}</span>
                    <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-slate-500 shadow-sm">
                      {previewCard.itemReady}
                    </span>
                  </div>
                ))}
              </div>
              <div className="mt-8 rounded-2xl bg-brand-gradient-soft p-4 text-left">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{previewCard.insightBadge}</p>
                <p className="mt-1 text-sm text-slate-600">{previewCard.insightCopy}</p>
              </div>
            </div>
            <span className="pointer-events-none absolute -bottom-8 left-1/2 h-24 w-24 -translate-x-1/2 rounded-full bg-brand-gradient opacity-30 blur-3xl" />
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-6 pb-24 xl:px-8">
          <div className="flex flex-col items-center text-center">
            <span className="rounded-full bg-slate-100 px-4 py-1 text-xs font-semibold uppercase tracking-wide text-slate-500">
              {featuresSection.label}
            </span>
            <h2 className="mt-3 text-3xl font-bold text-slate-900">{featuresSection.heading}</h2>
            <p className="mt-2 max-w-2xl text-sm text-slate-600 sm:text-base">{featuresSection.description}</p>
          </div>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {featuresSection.items.map((feature, index) => (
              <FeatureCard
                key={feature.title}
                icon={featureIcons[index % featureIcons.length]}
                title={feature.title}
                description={feature.description}
              />
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-6 pb-24 xl:px-8">
          <div className="flex flex-col items-center text-center">
            <span className="rounded-full bg-slate-100 px-4 py-1 text-xs font-semibold uppercase tracking-wide text-slate-500">
              {doctorsSection.label}
            </span>
            <h2 className="mt-3 text-3xl font-bold text-slate-900">{doctorsSection.heading}</h2>
            <p className="mt-2 max-w-2xl text-sm text-slate-600 sm:text-base">{doctorsSection.description}</p>
          </div>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {doctorsSection.quotes.map((doctor) => (
              <figure
                key={doctor.name}
                className="flex h-full flex-col rounded-3xl border border-slate-100 bg-white/95 p-6 text-left shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-gradient text-sm font-semibold uppercase text-white shadow-soft">
                  {doctor.name
                    .split(" ")
                    .map((part) => part[0])
                    .join("")
                    .slice(0, 2)}
                </div>
                <blockquote className="mt-4 flex-1 text-sm leading-relaxed text-slate-600">“{doctor.quote}”</blockquote>
                <figcaption className="mt-5">
                  <p className="text-sm font-semibold text-slate-900">{doctor.name}</p>
                  <p className="text-xs uppercase tracking-wide text-slate-400">{doctor.role}</p>
                </figcaption>
              </figure>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
