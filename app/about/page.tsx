"use client"
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { useLanguage } from "@/components/LanguageProvider";

interface AboutCopy {
  badge: string;
  heading: string;
  intro: string;
  mission: {
    heading: string;
    points: string[];
  };
  building: {
    heading: string;
    paragraphs: string[];
  };
  team: {
    heading: string;
    description: string;
    members: {
      name: string;
      title: string;
      bio: string;
    }[];
    footerTag: string;
  };
}

export default function AboutPage() {
  const { getCopy } = useLanguage();
  const about = getCopy<AboutCopy>("about");

  return (
    <div className="min-h-screen bg-slate-50/80">
      <Navbar />
      <main className="mx-auto max-w-5xl px-6 pb-20 pt-16 lg:px-8 lg:pt-20">
        <section className="rounded-3xl border border-slate-100 bg-white/90 p-8 shadow-soft backdrop-blur sm:p-12">
          <span className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-4 py-1 text-xs font-semibold uppercase tracking-wide text-slate-500">
            {about.badge}
          </span>
          <h1 className="mt-4 text-3xl font-bold text-slate-900 sm:text-4xl">{about.heading}</h1>
          <p className="mt-4 text-base leading-relaxed text-slate-600">{about.intro}</p>
        </section>

        <section className="mt-12 grid gap-6 sm:grid-cols-2">
          <div className="rounded-3xl border border-slate-100 bg-white p-8 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
            <h2 className="text-xl font-semibold text-slate-900">{about.mission.heading}</h2>
            <ul className="mt-4 space-y-3 text-sm text-slate-600">
              {about.mission.points.map((point) => (
                <li key={point} className="flex items-start gap-3">
                  <span className="mt-1 h-2.5 w-2.5 rounded-full bg-brand-gradient" />
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-3xl border border-slate-100 bg-white p-8 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
            <h2 className="text-xl font-semibold text-slate-900">{about.building.heading}</h2>
            {about.building.paragraphs.map((paragraph, index) => (
              <p key={index} className={`mt-4 text-sm leading-relaxed text-slate-600`}>
                {paragraph}
              </p>
            ))}
          </div>
        </section>

        <section className="mt-12">
          <h2 className="text-2xl font-bold text-slate-900">{about.team.heading}</h2>
          <p className="mt-2 max-w-2xl text-sm text-slate-600 sm:text-base">{about.team.description}</p>
          <div className="mt-6 grid gap-6 md:grid-cols-3">
            {about.team.members.map((member) => (
              <article
                key={member.name}
                className="flex h-full flex-col rounded-3xl border border-slate-100 bg-white p-6 text-left shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-brand-gradient text-lg font-semibold text-white shadow-soft">
                  {member.name
                    .split(" ")
                    .map((part) => part[0])
                    .join("")
                    .slice(0, 2)}
                </div>
                <h3 className="mt-4 text-lg font-semibold text-slate-900">{member.name}</h3>
                <p className="text-sm font-medium text-slate-500">{member.title}</p>
                <p className="mt-3 text-sm leading-relaxed text-slate-600">{member.bio}</p>
                <div className="mt-4 h-px bg-slate-100" />
                <p className="mt-3 text-xs uppercase tracking-wide text-slate-400">{about.team.footerTag}</p>
              </article>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
