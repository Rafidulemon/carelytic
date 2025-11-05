import type { ReactNode } from "react";

export interface FeatureCardProps {
  icon: ReactNode;
  title: string;
  description: string;
}

export default function FeatureCard({ icon, title, description }: FeatureCardProps) {
  return (
    <article className="group relative flex h-full flex-col rounded-3xl border border-slate-100 bg-white p-6 shadow-sm transition-transform duration-300 hover:-translate-y-1 hover:shadow-xl sm:p-7">
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-gradient text-white shadow-soft transition-transform duration-300 group-hover:scale-105">
        {icon}
      </div>
      <h3 className="mt-5 text-lg font-semibold text-slate-900">{title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-slate-500">{description}</p>
      <div className="pointer-events-none absolute inset-x-4 -bottom-5 h-12 rounded-full bg-brand-gradient-soft opacity-0 blur-xl transition duration-300 group-hover:opacity-100" />
    </article>
  );
}
