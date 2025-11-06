"use client"
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import UploadCard from "@/components/UploadCard";
import { useLanguage } from "@/components/LanguageProvider";
import Link from "next/link";

interface UploadCopy {
  hero: {
    badge: string;
    heading: string;
    description: string;
    infoLink: string;
  };
  steps: { label: string; description: string }[];
}

export default function UploadPage() {
  const { getCopy } = useLanguage();
  const upload = getCopy<UploadCopy>("upload");
  return (
    <div className="min-h-screen bg-slate-50/80">
      <Navbar />
      <main className="mx-auto max-w-5xl px-6 pb-20 pt-16 lg:px-8 lg:pt-20">
        <section className="mb-12 rounded-3xl border border-slate-100 bg-white/80 p-6 shadow-sm backdrop-blur sm:p-10">
          <div className="flex flex-col gap-4 text-center sm:flex-row sm:items-center sm:justify-between sm:text-left">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{upload.hero.badge}</p>
              <h1 className="mt-2 text-3xl font-bold text-slate-900 sm:text-4xl">{upload.hero.heading}</h1>
              <p className="mt-2 max-w-xl text-sm text-slate-600 sm:text-base">{upload.hero.description}</p>
            </div>
            <Link
              href="/about"
              className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-5 py-2 text-sm font-semibold text-slate-600 transition hover:border-slate-300 hover:text-slate-900"
            >
              {upload.hero.infoLink}
            </Link>
          </div>
          <div className="mt-8 grid gap-6 sm:grid-cols-3">
            {upload.steps.map((step) => (
              <div
                key={step.label}
                className="rounded-2xl border border-slate-100 bg-slate-50/60 p-4 text-left transition hover:-translate-y-1 hover:border-transparent hover:bg-white hover:shadow-lg"
              >
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{step.label}</p>
                <p className="mt-2 text-sm text-slate-600">{step.description}</p>
              </div>
            ))}
          </div>
        </section>

        <UploadCard />
      </main>
      <Footer />
    </div>
  );
}
