"use client";

import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { useLanguage } from "@/components/LanguageProvider";

interface PrivacyCopy {
  hero: {
    badge: string;
    heading: string;
    updated: string;
    intro: string;
  };
  sections: {
    title: string;
    paragraphs: string[];
    bullets?: string[];
  }[];
  commitments: {
    heading: string;
    points: string[];
  };
  contact: {
    heading: string;
    description: string;
    emailCta: string;
  };
}

export default function PrivacyPage() {
  const { getCopy } = useLanguage();
  const privacy = getCopy<PrivacyCopy>("privacy");

  return (
    <div className="min-h-screen bg-slate-50/80">
      <Navbar />
      <main className="mx-auto max-w-5xl px-6 pb-20 pt-16 lg:px-8 lg:pt-20">
        <section className="rounded-3xl border border-slate-100 bg-white/95 p-8 shadow-soft backdrop-blur sm:p-12">
          <span className="inline-flex items-center gap-2 rounded-full bg-brand-gradient-soft px-4 py-1 text-xs font-semibold uppercase tracking-wide text-slate-600">
            {privacy.hero.badge}
          </span>
          <h1 className="mt-4 text-3xl font-bold text-slate-900 sm:text-4xl">{privacy.hero.heading}</h1>
          <p className="mt-2 text-xs font-semibold uppercase tracking-wide text-slate-400">{privacy.hero.updated}</p>
          <p className="mt-4 text-base leading-relaxed text-slate-600">{privacy.hero.intro}</p>
        </section>

        <div className="mt-12 space-y-8">
          {privacy.sections.map((section) => (
            <section
              key={section.title}
              className="rounded-3xl border border-slate-100 bg-white p-8 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
            >
              <h2 className="text-xl font-semibold text-slate-900">{section.title}</h2>
              {section.paragraphs.map((paragraph, index) => (
                <p key={index} className="mt-4 text-sm leading-relaxed text-slate-600">
                  {paragraph}
                </p>
              ))}
              {section.bullets && section.bullets.length > 0 && (
                <ul className="mt-5 space-y-3 text-sm text-slate-600">
                  {section.bullets.map((item) => (
                    <li key={item} className="flex items-start gap-3">
                      <span className="mt-1 h-2.5 w-2.5 rounded-full bg-brand-gradient" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          ))}
        </div>

        <section className="mt-12 rounded-3xl border border-slate-100 bg-white p-8 shadow-sm">
          <h2 className="text-xl font-semibold text-slate-900">{privacy.commitments.heading}</h2>
          <ul className="mt-5 space-y-3 text-sm text-slate-600">
            {privacy.commitments.points.map((point) => (
              <li key={point} className="flex items-start gap-3">
                <span className="mt-1 h-2.5 w-2.5 rounded-full bg-brand-gradient" />
                <span>{point}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="mt-12 rounded-3xl border border-brand-gradient bg-brand-gradient-soft p-8 text-slate-900 shadow-soft">
          <h2 className="text-xl font-semibold text-slate-900">{privacy.contact.heading}</h2>
          <p className="mt-3 text-sm leading-relaxed text-slate-700">{privacy.contact.description}</p>
          <a
            href="mailto:rafidul.islam054@gmail.com"
            className="mt-5 inline-flex items-center justify-center rounded-full bg-brand-gradient px-5 py-2 text-sm font-semibold text-white shadow-soft transition hover:-translate-y-0.5 hover:shadow-lg"
          >
            {privacy.contact.emailCta}
          </a>
        </section>
      </main>
      <Footer />
    </div>
  );
}
