import Link from "next/link";
import { notFound } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import prisma from "@/lib/prisma";

export const revalidate = 0;

interface PageProps {
  params: Promise<{ id?: string | string[] }>;
}

function splitLines(value: string) {
  return value
    .split(/\r?\n+/)
    .map((line) => line.trim())
    .filter((line) => line.length > 0);
}

function formatDate(value: Date) {
  return value.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default async function ReportAnalysisPage({ params }: PageProps) {
  const resolvedParams = await params;
  const id = Array.isArray(resolvedParams.id)
    ? resolvedParams.id[0]
    : resolvedParams.id;

  if (!id) {
    notFound();
  }

  const report = await prisma.report.findUnique({
    where: { id },
    include: {
      analysis: true,
    },
  });

  if (!report || !report.analysis) {
    notFound();
  }

  const detailItems = splitLines(report.analysis.details);
  const actionItems = splitLines(report.analysis.actions);
  const completedAt = report.completedAt ?? report.uploadedAt;

  return (
    <div className="min-h-screen bg-slate-50/80">
      <Navbar />
      <main className="mx-auto max-w-4xl px-4 pb-20 pt-16 sm:px-6 lg:px-8">
        <section className="flex flex-col gap-8">
          <header className="flex flex-col gap-4">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 transition hover:text-slate-900"
            >
          <svg
            className="h-4 w-4"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M15 18l-6-6 6-6" />
          </svg>
          Back to dashboard
        </Link>
        <div className="rounded-3xl bg-white p-6 shadow-soft ring-1 ring-slate-100">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
            {report.analysis.language === "bn" ? "স্বাস্থ্য প্রতিবেদন" : "Report overview"}
          </p>
          <h1 className="mt-2 text-2xl font-bold text-slate-900">
            {report.originalName || "Medical report analysis"}
          </h1>
          <div className="mt-4 flex flex-wrap items-center gap-3 text-xs text-slate-500">
            <span>
              {report.analysis.language === "bn" ? "বিশ্লেষণের ভাষা: " : "Analysis language: "}
              <span className="font-semibold text-slate-700">
                {report.analysis.language === "bn" ? "বাংলা" : "English"}
              </span>
            </span>
            <span className="h-1 w-1 rounded-full bg-slate-300" aria-hidden="true" />
            <span>
              {report.analysis.language === "bn" ? "সম্পন্ন হয়েছে: " : "Completed on: "}
              <span className="font-semibold text-slate-700">{formatDate(completedAt)}</span>
            </span>
          </div>
        </div>
      </header>

      <article className="space-y-6 rounded-3xl bg-white p-6 shadow-soft ring-1 ring-slate-100 sm:p-8">
        <section>
          <h2 className="text-lg font-semibold text-slate-900">
            {report.analysis.language === "bn" ? "সারসংক্ষেপ" : "Summary"}
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-slate-600">{report.analysis.summary}</p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-slate-900">
            {report.analysis.language === "bn" ? "বিশদ বিশ্লেষণ" : "Detailed analysis"}
          </h2>
          <ul className="mt-3 space-y-3 text-sm leading-relaxed text-slate-600">
            {detailItems.map((item, index) => (
              <li key={index} className="rounded-2xl bg-slate-50/80 p-4 ring-1 ring-slate-100">
                {item}
              </li>
            ))}
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-slate-900">
            {report.analysis.language === "bn" ? "প্রয়োজনীয় পদক্ষেপ" : "Recommended actions"}
          </h2>
          <ul className="mt-3 space-y-3 text-sm leading-relaxed text-slate-600">
            {actionItems.map((item, index) => (
              <li key={index} className="flex items-start gap-3 rounded-2xl bg-emerald-50/70 p-4 ring-1 ring-emerald-100">
                <span className="mt-1 inline-flex h-2.5 w-2.5 flex-shrink-0 rounded-full bg-emerald-400" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
          <p className="mt-4 text-xs text-slate-500">
            {report.analysis.language === "bn"
              ? "এই সুপারিশগুলো তথ্যের জন্য। ব্যক্তিগত চিকিৎসার জন্য অবশ্যই আপনার নিবন্ধিত চিকিৎসকের পরামর্শ নিন।"
              : "These recommendations are informational. Always consult your licensed clinician before making medical decisions."}
          </p>
        </section>
      </article>

          <footer className="flex flex-wrap items-center justify-between gap-3">
            <Link
              href="/"
              className="rounded-full border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-600 transition hover:border-slate-300 hover:text-slate-900"
            >
              {report.analysis.language === "bn" ? "আরও রিপোর্ট আপলোড করুন" : "Upload another report"}
            </Link>
            <Link
              href="/account"
              className="rounded-full bg-brand-gradient px-4 py-2 text-xs font-semibold text-white shadow-soft transition hover:-translate-y-0.5 hover:shadow-lg"
            >
              {report.analysis.language === "bn" ? "ইতিহাস দেখুন" : "View report history"}
            </Link>
          </footer>
        </section>
      </main>
      <Footer />
    </div>
  );
}
