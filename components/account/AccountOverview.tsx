"use client";

import { useAuth } from "@/components/AuthProvider";
import { useSubscriptionPlans } from "../subscriptionPlans";
import { useLanguage } from "@/components/LanguageProvider";
import Link from "next/link";
import { useMemo } from "react";

type AuthUser = NonNullable<ReturnType<typeof useAuth>["user"]>;

interface AccountCopy {
  unauthenticated: {
    heading: string;
    description: string;
    login: string;
    createAccount: string;
  };
  header: {
    badge: string;
    greeting: string;
    greetingFallback: string;
    description: string;
    phone: string;
    email: string;
    emailPlaceholder: string;
    plan: string;
    creditsAvailable: string;
    uploadCta: string;
    logout: string;
  };
  reports: {
    heading: string;
    count: {
      single: string;
      plural: string;
    };
    empty: string;
    alerts: string;
    download: string;
    share: string;
  };
  health: {
    badge: string;
    heading: string;
    description: string;
    updateButton: string;
    bloodGroup: string;
    diabetes: string;
    hypertension: string;
    bool: {
      yes: string;
      no: string;
    };
    notProvided: string;
    note: string;
  };
  subscriptions: {
    badge: string;
    heading: string;
    description: string;
    renewNote: string;
    currentPlan: string;
    choosePlan: string;
    includes: string; // ✅ e.g. "Includes {{credits}} AI report credits"
    includesNone: string; // ✅ e.g. "No included credits"
  };
}

export default function AccountOverview() {
  const { user } = useAuth();
  const { getCopy } = useLanguage();
  const account = getCopy<AccountCopy>("account");

  if (!user) {
    return <UnauthenticatedPanel copy={account} />;
  }

  return (
    <section className="space-y-10">
      <AccountHeader copy={account} user={user} />
      <ReportsGrid copy={account} user={user} />
      <HealthProfile copy={account} user={user} />
      <SubscriptionChooser copy={account} user={user} />
    </section>
  );
}

function UnauthenticatedPanel({ copy }: { copy: AccountCopy }) {
  return (
    <section className="mx-auto max-w-3xl rounded-4xl border border-slate-100 bg-white p-10 text-center shadow-soft">
      <h1 className="text-3xl font-bold text-slate-900">
        {copy.unauthenticated.heading}
      </h1>
      <p className="mt-3 text-sm text-slate-600">
        {copy.unauthenticated.description}
      </p>
      <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
        <Link
          href="/login"
          className="inline-flex items-center justify-center rounded-full bg-brand-gradient px-6 py-3 text-sm font-semibold text-white shadow-soft transition hover:-translate-y-0.5 hover:shadow-lg"
        >
          {copy.unauthenticated.login}
        </Link>
        <Link
          href="/signup"
          className="inline-flex items-center justify-center rounded-full border border-slate-200 px-6 py-3 text-sm font-semibold text-slate-600 transition hover:border-slate-300 hover:text-slate-900"
        >
          {copy.unauthenticated.createAccount}
        </Link>
      </div>
    </section>
  );
}

function AccountHeader({ copy, user }: { copy: AccountCopy; user: AuthUser }) {
  const plans = useSubscriptionPlans();
  const { t } = useLanguage();

  const planTitle =
    plans.find((plan) => plan.id === user.subscriptionPlan)?.title ??
    t("plans.payg.title");
  const creditsLabel = t("account.header.creditsAvailable", {
    credits: user.credits,
  });
  const greetingName = user.name ?? copy.header.greetingFallback;
  const greeting = copy.header.greeting.replace("{{name}}", greetingName);

  return (
    <div className="flex flex-col justify-between gap-6 rounded-4xl border border-slate-100 bg-white p-8 shadow-soft lg:flex-row lg:items-center lg:p-10">
      <div>
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
          {copy.header.badge}
        </p>
        <h1 className="mt-2 text-3xl font-bold text-slate-900">{greeting}</h1>
        <p className="mt-2 text-sm text-slate-600">{copy.header.description}</p>
        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          <InfoCard title={copy.header.phone} value={user.phone} />
          <InfoCard
            title={copy.header.email}
            value={user.email ?? copy.header.emailPlaceholder}
          />
          <InfoCard
            title={copy.header.plan}
            value={planTitle}
            subtitle={creditsLabel}
          />
        </div>
      </div>
      <div className="flex flex-col gap-3">
        <Link
          href="/upload"
          className="inline-flex items-center justify-center rounded-full bg-brand-gradient px-6 py-3 text-sm font-semibold text-white shadow-soft transition hover:-translate-y-0.5 hover:shadow-lg"
        >
          {copy.header.uploadCta}
        </Link>
        <LogoutButton label={copy.header.logout} />
      </div>
    </div>
  );
}

function LogoutButton({ label }: { label: string }) {
  const { logout } = useAuth();
  return (
    <button
      type="button"
      onClick={logout}
      className="inline-flex items-center justify-center rounded-full border border-slate-200 px-6 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500 transition hover:border-slate-300 hover:text-slate-900"
    >
      {label}
    </button>
  );
}

function ReportsGrid({ copy, user }: { copy: AccountCopy; user: AuthUser }) {
  const { language, t } = useLanguage();
  const dateFormatter = useMemo(
    () =>
      new Intl.DateTimeFormat(language === "bn" ? "bn-BD" : "en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
      }),
    [language]
  );

  const reportCountKey = user.history.length === 1 ? "single" : "plural";
  const reportCountLabel = t(`account.reports.count.${reportCountKey}`, {
    count: user.history.length,
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-slate-900">
          {copy.reports.heading}
        </h2>
        <p className="text-sm font-semibold text-slate-500">
          {reportCountLabel}
        </p>
      </div>
      {user.history.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-slate-200 bg-white p-10 text-center text-sm text-slate-500">
          {copy.reports.empty}
        </div>
      ) : (
        <div className="grid gap-5 md:grid-cols-2">
          {user.history.map((entry) => {
            const alertCount = entry.highlights.length;
            const alertsLabel = t("account.reports.alerts", {
              count: alertCount,
            });
            return (
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
                      {alertsLabel}
                    </span>
                  </div>
                  <h3 className="mt-2 text-lg font-semibold text-slate-900">
                    {entry.title}
                  </h3>
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
                <div className="mt-5">
                  <Link
                    href={`/reports/${entry.id}`}
                    className="inline-flex items-center gap-2 rounded-full bg-brand-gradient px-4 py-2 text-xs font-semibold text-white shadow-soft transition hover:-translate-y-0.5 hover:shadow-lg"
                  >
                    <span>{t("common.actions.viewDetails")}</span>
                    <svg
                      className="h-3.5 w-3.5"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.6"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M5 12h14" />
                      <path d="M13 6l6 6-6 6" />
                    </svg>
                  </Link>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}

function HealthProfile({ copy, user }: { copy: AccountCopy; user: AuthUser }) {
  const { health } = copy;

  const boolLabel = (value: boolean | undefined) => {
    if (value === undefined) return health.notProvided;
    return value ? health.bool.yes : health.bool.no;
  };

  return (
    <div className="rounded-4xl border border-slate-100 bg-white p-8 shadow-sm">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
            {health.badge}
          </p>
          <h2 className="mt-2 text-2xl font-bold text-slate-900">
            {health.heading}
          </h2>
          <p className="mt-2 text-sm text-slate-600">{health.description}</p>
        </div>
        <button
          type="button"
          className="inline-flex items-center justify-center rounded-full border border-slate-200 px-5 py-2 text-sm font-semibold text-slate-600 transition hover:border-slate-300 hover:text-slate-900"
        >
          {health.updateButton}
        </button>
      </div>
      <dl className="mt-6 grid gap-4 sm:grid-cols-3">
        <InfoStat
          label={health.bloodGroup}
          value={user.bloodGroup ?? health.notProvided}
        />
        <InfoStat label={health.diabetes} value={boolLabel(user.isDiabetic)} />
        <InfoStat
          label={health.hypertension}
          value={boolLabel(user.hasHypertension)}
        />
      </dl>
      <p className="mt-4 text-xs text-slate-500">{health.note}</p>
    </div>
  );
}

function SubscriptionChooser({
  copy,
  user,
}: {
  copy: AccountCopy;
  user: AuthUser;
}) {
  const { purchaseSubscription } = useAuth();
  const plans = useSubscriptionPlans();

  return (
    <section className="rounded-4xl border border-slate-100 bg-white p-8 shadow-sm">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
            {copy.subscriptions.badge}
          </p>
          <h2 className="mt-2 text-2xl font-bold text-slate-900">
            {copy.subscriptions.heading}
          </h2>
          <p className="mt-2 text-sm text-slate-600">
            {copy.subscriptions.description}
          </p>
        </div>
      </div>
      <div className="mt-6 grid gap-4 md:grid-cols-3">
        {plans.map((plan) => {
          const isActive = user.subscriptionPlan === plan.id;
          const [includesPrefix = "", includesSuffix = ""] =
            copy.subscriptions.includes.split("{{credits}}");
          const includesContent = plan.credits
            ? `${plan.credits}${includesSuffix}`
            : copy.subscriptions.includesNone;
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
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  {plan.title}
                </p>
                <p className="mt-2 text-lg font-semibold text-slate-900">
                  {plan.price}
                </p>
                <p className="mt-2 text-sm text-slate-600">
                  {plan.description}
                </p>
                <p className="mt-3 text-xs font-semibold uppercase tracking-wide text-slate-400">
                  {plan.highlight}
                </p>
              </div>
              <div className="mt-5 flex flex-col gap-3">
                <p className="text-sm font-semibold text-slate-700">
                  {includesPrefix}
                  <span className="font-bold text-slate-900">
                    {includesContent}
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
                  {isActive
                    ? copy.subscriptions.currentPlan
                    : copy.subscriptions.choosePlan}
                </button>
              </div>
            </article>
          );
        })}
      </div>
      <p className="mt-4 text-xs text-slate-500">
        {copy.subscriptions.renewNote}
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
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
        {title}
      </p>
      <p className="mt-1 text-sm font-semibold text-slate-900">{value}</p>
      {subtitle && <p className="mt-1 text-xs text-slate-500">{subtitle}</p>}
    </div>
  );
}

function InfoStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-3xl border border-slate-100 bg-slate-50/70 p-4">
      <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">
        {label}
      </dt>
      <dd className="mt-1 text-sm font-semibold text-slate-900">{value}</dd>
    </div>
  );
}
