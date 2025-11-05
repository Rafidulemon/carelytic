"use client";

import { useAuth } from "@/components/AuthProvider";
import Link from "next/link";
import { subscriptionPlans } from "../subscriptionPlans";

const dateFormatter = new Intl.DateTimeFormat("en-GB", {
  day: "numeric",
  month: "short",
  year: "numeric",
});

const boolLabel = (value: boolean | undefined) => {
  if (value === undefined) return "Not provided";
  return value ? "Yes" : "No";
};

const getPlanTitle = (plan: string) =>
  subscriptionPlans.find((item) => item.id === plan)?.title ?? "Pay as you go";

export default function AccountOverview() {
  const { user } = useAuth();

  if (!user) {
    return (
      <section className="mx-auto max-w-3xl rounded-4xl border border-slate-100 bg-white p-10 text-center shadow-soft">
        <h1 className="text-3xl font-bold text-slate-900">Sign in to view your Carelytic history</h1>
        <p className="mt-3 text-sm text-slate-600">
          Your account keeps track of every report you upload and the AI insights generated for you. Sign in or create an
          account to continue.
        </p>
        <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
          <Link
            href="/login"
            className="inline-flex items-center justify-center rounded-full bg-brand-gradient px-6 py-3 text-sm font-semibold text-white shadow-soft transition hover:-translate-y-0.5 hover:shadow-lg"
          >
            Log in
          </Link>
          <Link
            href="/signup"
            className="inline-flex items-center justify-center rounded-full border border-slate-200 px-6 py-3 text-sm font-semibold text-slate-600 transition hover:border-slate-300 hover:text-slate-900"
          >
            Create account
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="space-y-10">
      <AccountHeader />
      <ReportsGrid />
      <HealthProfile />
      <SubscriptionChooser />
    </section>
  );
}

function AccountHeader() {
  const { user, logout } = useAuth();

  if (!user) return null;

  return (
    <div className="flex flex-col justify-between gap-6 rounded-4xl border border-slate-100 bg-white p-8 shadow-soft lg:flex-row lg:items-center lg:p-10">
      <div>
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Carelytic account</p>
        <h1 className="mt-2 text-3xl font-bold text-slate-900">Welcome back, {user.name ?? "Carelytic member"}</h1>
        <p className="mt-2 text-sm text-slate-600">
          Manage your profile, view past AI interpretations, and keep track of your credits and subscriptions.
        </p>
        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          <InfoCard title="Phone" value={user.phone} />
          <InfoCard title="Email" value={user.email ?? "Add an email to receive updates"} />
          <InfoCard
            title="Current plan"
            value={getPlanTitle(user.subscriptionPlan)}
            subtitle={`Credits available: ${user.credits}`}
          />
        </div>
      </div>
      <div className="flex flex-col gap-3">
        <Link
          href="/upload"
          className="inline-flex items-center justify-center rounded-full bg-brand-gradient px-6 py-3 text-sm font-semibold text-white shadow-soft transition hover:-translate-y-0.5 hover:shadow-lg"
        >
          Upload new report
        </Link>
        <button
          type="button"
          onClick={logout}
          className="inline-flex items-center justify-center rounded-full border border-slate-200 px-6 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500 transition hover:border-slate-300 hover:text-slate-900"
        >
          Log out
        </button>
      </div>
    </div>
  );
}

function ReportsGrid() {
  const { user } = useAuth();
  if (!user) return null;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-slate-900">Recent medical reports</h2>
        <p className="text-sm font-semibold text-slate-500">
          {user.history.length} report{user.history.length === 1 ? "" : "s"}
        </p>
      </div>
      {user.history.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-slate-200 bg-white p-10 text-center text-sm text-slate-500">
          Upload your first report to begin building your Carelytic history.
        </div>
      ) : (
        <div className="grid gap-5 md:grid-cols-2">
          {user.history.map((entry) => (
            <article
              key={entry.id}
              className="flex h-full flex-col justify-between rounded-3xl border border-slate-100 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
            >
              <div>
                <div className="flex items-center justify-between">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                    {dateFormatter.format(new Date(entry.date))}
                  </p>
                  <span className="rounded-full bg-brand-gradient-soft px-3 py-1 text-xs font-semibold text-slate-700">
                    {entry.highlights.filter((item) => item.includes("(Attention)")).length} alerts
                  </span>
                </div>
                <h3 className="mt-2 text-lg font-semibold text-slate-900">{entry.title}</h3>
                <p className="mt-2 text-sm text-slate-600">{entry.summary}</p>
              </div>
              <ul className="mt-4 space-y-2 text-sm text-slate-500">
                {entry.highlights.map((highlight, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="mt-1 h-2 w-2 rounded-full bg-brand-gradient" />
                    <span>{highlight}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-4 flex items-center gap-3 text-xs font-semibold uppercase tracking-wide text-slate-400">
                <span>Download summary</span>
                <span className="h-1 w-1 rounded-full bg-slate-300" />
                <span>Share with doctor</span>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}

function HealthProfile() {
  const { user } = useAuth();
  if (!user) return null;

  return (
    <div className="rounded-4xl border border-slate-100 bg-white p-8 shadow-sm">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Health profile</p>
          <h2 className="mt-2 text-2xl font-bold text-slate-900">Key medical details</h2>
          <p className="mt-2 text-sm text-slate-600">
            Carelytic tailors insights using your baseline health information. Update these details whenever something
            changes.
          </p>
        </div>
        <button
          type="button"
          className="inline-flex items-center justify-center rounded-full border border-slate-200 px-5 py-2 text-sm font-semibold text-slate-600 transition hover:border-slate-300 hover:text-slate-900"
        >
          Update health profile (coming soon)
        </button>
      </div>
      <dl className="mt-6 grid gap-4 sm:grid-cols-3">
        <InfoStat label="Blood group" value={user.bloodGroup ?? "Not provided"} />
        <InfoStat label="Diabetes" value={boolLabel(user.isDiabetic)} />
        <InfoStat label="High blood pressure" value={boolLabel(user.hasHypertension)} />
      </dl>
      <p className="mt-4 text-xs text-slate-500">
        Want to add more conditions or medications? A detailed health profile editor is on the way.
      </p>
    </div>
  );
}

function SubscriptionChooser() {
  const { user, purchaseSubscription } = useAuth();
  if (!user) return null;

  return (
    <section className="rounded-4xl border border-slate-100 bg-white p-8 shadow-sm">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Subscriptions</p>
          <h2 className="mt-2 text-2xl font-bold text-slate-900">Unlock more value with credits</h2>
          <p className="mt-2 text-sm text-slate-600">
            Pay-as-you-go costs BDT 10 per report. Monthly and yearly subscriptions add bonus credits and a guaranteed 20%
            savings. Every unlocked report uses 10 credits.
          </p>
        </div>
      </div>
      <div className="mt-6 grid gap-4 md:grid-cols-3">
        {subscriptionPlans.map((plan) => {
          const isActive = user.subscriptionPlan === plan.id;
          return (
            <article
              key={plan.id}
              className={`flex h-full flex-col rounded-3xl border p-6 transition ${
                isActive
                  ? "border-brand-gradient bg-brand-gradient-soft"
                  : "border-slate-100 bg-slate-50/60 hover:-translate-y-1 hover:border-transparent hover:bg-white hover:shadow-lg"
              }`}
            >
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{plan.title}</p>
                <p className="mt-2 text-lg font-semibold text-slate-900">{plan.price}</p>
                <p className="mt-2 text-sm text-slate-600">{plan.description}</p>
                <p className="mt-3 text-xs font-semibold uppercase tracking-wide text-slate-400">{plan.highlight}</p>
              </div>
              <div className="mt-5 flex flex-col gap-3">
                <p className="text-sm font-semibold text-slate-700">
                  Includes{" "}
                  <span className="font-bold text-slate-900">
                    {plan.credits ? `${plan.credits} credits` : "no prepaid credits"}
                  </span>
                </p>
                <button
                  type="button"
                  onClick={() => purchaseSubscription(plan.id)}
                  className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                    isActive
                      ? "bg-brand-gradient text-white shadow-soft"
                      : "border border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:text-slate-900"
                  }`}
                >
                  {isActive ? "Current plan" : "Choose plan"}
                </button>
              </div>
            </article>
          );
        })}
      </div>
      <p className="mt-4 text-xs text-slate-500">
        Subscriptions renew automatically. Cancel anytime to switch back to pay-as-you-go pricing.
      </p>
    </section>
  );
}

function InfoCard({
  title,
  value,
  subtitle,
}: {
  title: string;
  value: string;
  subtitle?: string;
}) {
  return (
    <div className="rounded-3xl border border-slate-100 bg-slate-50/80 p-4">
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{title}</p>
      <p className="mt-1 text-sm font-semibold text-slate-900">{value}</p>
      {subtitle && <p className="mt-1 text-xs text-slate-500">{subtitle}</p>}
    </div>
  );
}

function InfoStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-3xl border border-slate-100 bg-slate-50/70 p-4">
      <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">{label}</dt>
      <dd className="mt-1 text-sm font-semibold text-slate-900">{value}</dd>
    </div>
  );
}
