import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";

const missionPoints = [
  "Translate complex lab values into language people understand without losing clinical precision.",
  "Equip care teams with AI summaries that save time and surface the right follow-up actions.",
  "Respect patient privacy with on-device preprocessing and secure, encrypted workflows.",
];

const team = [
  {
    name: "Dr. Maya Chen",
    title: "Chief Medical Officer",
    bio: "Board-certified internist with 12 years in hospital medicine, leading clinical validation at Carelytic.",
  },
  {
    name: "Leo Martinez",
    title: "Head of Product",
    bio: "Former product lead at a digital therapeutics startup, passionate about building empathetic health software.",
  },
  {
    name: "Anika Patel",
    title: "Lead ML Engineer",
    bio: "Specializes in multimodal medical AI and responsible model deployment across regulated environments.",
  },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-slate-50/80">
      <Navbar />
      <main className="mx-auto max-w-5xl px-6 pb-20 pt-16 lg:px-8 lg:pt-20">
        <section className="rounded-3xl border border-slate-100 bg-white/90 p-8 shadow-soft backdrop-blur sm:p-12">
          <span className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-4 py-1 text-xs font-semibold uppercase tracking-wide text-slate-500">
            About Carelytic
          </span>
          <h1 className="mt-4 text-3xl font-bold text-slate-900 sm:text-4xl">
            We believe clarity transforms healthcare decisions
          </h1>
          <p className="mt-4 text-base leading-relaxed text-slate-600">
            Carelytic was founded by clinicians, engineers, and designers who have seen how overwhelming medical reports
            can be for patients and time-strapped providers. We built Carelytic to empower proactive, informed
            conversations around your health data.
          </p>
        </section>

        <section className="mt-12 grid gap-6 sm:grid-cols-2">
          <div className="rounded-3xl border border-slate-100 bg-white p-8 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
            <h2 className="text-xl font-semibold text-slate-900">Our mission</h2>
            <ul className="mt-4 space-y-3 text-sm text-slate-600">
              {missionPoints.map((point) => (
                <li key={point} className="flex items-start gap-3">
                  <span className="mt-1 h-2.5 w-2.5 rounded-full bg-brand-gradient" />
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-3xl border border-slate-100 bg-white p-8 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
            <h2 className="text-xl font-semibold text-slate-900">What we&apos;re building</h2>
            <p className="mt-4 text-sm leading-relaxed text-slate-600">
              Carelytic blends advanced natural language processing with trusted medical datasets to deliver insights you
              can act on. From lab trends to imaging notes, our platform surfaces what matters, suggests next steps, and
              keeps clinicians in the loop. Transparency, accuracy, and compassion guide every product decision.
            </p>
            <p className="mt-4 text-sm leading-relaxed text-slate-600">
              We partner with health systems and research institutions to ensure Carelytic meets the highest bar for
              safety and compliance — because precision and trust are non-negotiable in healthcare.
            </p>
          </div>
        </section>

        <section className="mt-12">
          <h2 className="text-2xl font-bold text-slate-900">Meet the team leading Carelytic</h2>
          <p className="mt-2 max-w-2xl text-sm text-slate-600 sm:text-base">
            Diverse expertise in clinical practice, AI research, and human-centered design fuels our commitment to better
            health communication.
          </p>
          <div className="mt-6 grid gap-6 md:grid-cols-3">
            {team.map((member) => (
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
                <p className="mt-3 text-xs uppercase tracking-wide text-slate-400">
                  Healthcare AI · Responsible innovation · Patient empathy
                </p>
              </article>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
