import FeatureCard from "@/components/FeatureCard";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import Link from "next/link";

const features = [
  {
    title: "Upload Reports",
    description:
      "Securely upload PDFs or images in seconds with drag-and-drop, automatic file validation, and zero vendor lock-in.",
    icon: (
      <svg
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
  },
  {
    title: "AI Interpretation",
    description:
      "Turn clinical jargon into patient-friendly summaries fueled by Carelytic’s healthcare-specific language models.",
    icon: (
      <svg
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
  },
  {
    title: "Health Insights",
    description:
      "Spot trends, risks, and next-step suggestions instantly with color-coded dashboards designed for clinicians and patients.",
    icon: (
      <svg
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
  },
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-slate-50/80">
      <Navbar />
      <main className="relative overflow-hidden">
        <div className="absolute left-1/2 top-24 h-64 w-64 -translate-x-1/2 rounded-full bg-brand-gradient opacity-20 blur-3xl" />
        <section className="mx-auto flex max-w-6xl flex-col items-center gap-12 px-6 pb-16 pt-20 text-center lg:flex-row lg:items-center lg:text-left lg:pt-24 xl:px-8">
          <div className="max-w-xl space-y-6">
            <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-1 text-xs font-semibold uppercase tracking-wide text-slate-600 shadow-sm">
              Trusted AI for healthcare data
            </span>
            <h1 className="text-4xl font-bold leading-tight text-slate-900 sm:text-5xl">
              AI that understands <span className="text-gradient">your medical reports</span>
            </h1>
            <p className="text-base leading-relaxed text-slate-600 sm:text-lg">
              Carelytic transforms complex lab results and clinician notes into a guided experience. Upload your reports,
              interpret them in plain language, and surface actionable health insights — all in one secure workspace.
            </p>
            <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-center sm:justify-start">
              <Link
                href="/upload"
                className="inline-flex items-center justify-center rounded-full bg-brand-gradient px-6 py-3 text-sm font-semibold text-white shadow-soft transition-transform hover:-translate-y-0.5 hover:shadow-lg"
              >
                Get Started
              </Link>
              <Link
                href="/about"
                className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-600 transition hover:border-slate-300 hover:text-slate-900"
              >
                Meet the team
              </Link>
            </div>
            <div className="grid gap-4 text-left sm:grid-cols-2">
              <div className="rounded-3xl border border-slate-100 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Turnaround time</p>
                <p className="mt-1 text-2xl font-semibold text-slate-900">
                  &lt; 30 <span className="text-base font-medium text-slate-500">seconds per report</span>
                </p>
              </div>
              <div className="rounded-3xl border border-slate-100 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Insights flagged</p>
                <p className="mt-1 text-2xl font-semibold text-slate-900">
                  3.2<span className="text-base font-medium text-slate-500"> avg potential alerts</span>
                </p>
              </div>
            </div>
          </div>
          <div className="relative w-full max-w-md">
            <div className="relative overflow-hidden rounded-3xl border border-slate-100 bg-white/90 p-6 shadow-xl backdrop-blur">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-slate-500">Latest report</p>
                  <h2 className="text-xl font-semibold text-slate-900">Blood chemistry</h2>
                </div>
                <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-600">
                  Stable
                </span>
              </div>
              <div className="mt-6 space-y-3">
                {features.map((feature) => (
                  <div
                    key={feature.title}
                    className="flex items-center justify-between rounded-2xl bg-slate-50/70 p-3 text-left transition hover:bg-white"
                  >
                    <span className="text-sm font-semibold text-slate-600">{feature.title}</span>
                    <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-slate-500 shadow-sm">
                      Ready
                    </span>
                  </div>
                ))}
              </div>
              <div className="mt-8 rounded-2xl bg-brand-gradient-soft p-4 text-left">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Carelytic insight</p>
                <p className="mt-1 text-sm text-slate-600">
                  Mildly elevated glucose detected. Consider a follow-up fasting test and share insights with your physician.
                </p>
              </div>
            </div>
            <span className="pointer-events-none absolute -bottom-8 left-1/2 h-24 w-24 -translate-x-1/2 rounded-full bg-brand-gradient opacity-30 blur-3xl" />
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-6 pb-24 xl:px-8">
          <div className="flex flex-col items-center text-center">
            <span className="rounded-full bg-slate-100 px-4 py-1 text-xs font-semibold uppercase tracking-wide text-slate-500">
              Why Carelytic
            </span>
            <h2 className="mt-3 text-3xl font-bold text-slate-900">Built for clarity and clinical rigor</h2>
            <p className="mt-2 max-w-2xl text-sm text-slate-600 sm:text-base">
              We blend medical-grade accuracy with approachable design so patients and care teams can stay aligned.
              Explore the core capabilities powering Carelytic.
            </p>
          </div>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {features.map((feature) => (
              <FeatureCard
                key={feature.title}
                icon={feature.icon}
                title={feature.title}
                description={feature.description}
              />
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
