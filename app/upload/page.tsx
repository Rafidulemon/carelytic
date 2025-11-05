import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import UploadCard from "@/components/UploadCard";
import Link from "next/link";

const steps = [
  {
    label: "Upload",
    description: "Drag & drop or select a medical report file.",
  },
  {
    label: "Analyze",
    description: "Carelytic scans values, flags anomalies, and drafts summaries.",
  },
  {
    label: "Share",
    description: "Export insights or share them securely with your care team.",
  },
];

export default function UploadPage() {
  return (
    <div className="min-h-screen bg-slate-50/80">
      <Navbar />
      <main className="mx-auto max-w-5xl px-6 pb-20 pt-16 lg:px-8 lg:pt-20">
        <section className="mb-12 rounded-3xl border border-slate-100 bg-white/80 p-6 shadow-sm backdrop-blur sm:p-10">
          <div className="flex flex-col gap-4 text-center sm:flex-row sm:items-center sm:justify-between sm:text-left">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Upload medical reports</p>
              <h1 className="mt-2 text-3xl font-bold text-slate-900 sm:text-4xl">
                Bring your reports to life in seconds
              </h1>
              <p className="mt-2 max-w-xl text-sm text-slate-600 sm:text-base">
                Carelytic extracts and interprets the metrics that matter. Upload any lab, imaging, or clinical report —
                our AI highlights key values, trends, and recommended follow-ups.
              </p>
            </div>
            <Link
              href="/about"
              className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-5 py-2 text-sm font-semibold text-slate-600 transition hover:border-slate-300 hover:text-slate-900"
            >
              How it works
            </Link>
          </div>
          <div className="mt-8 grid gap-6 sm:grid-cols-3">
            {steps.map((step) => (
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
