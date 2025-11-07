"use client";

import Link from "next/link";
import { useCallback, useMemo, useState } from "react";
import { useAuth, type HistoryEntry } from "@/components/AuthProvider";
import { useLanguage } from "@/components/LanguageProvider";

interface ReportsPageCopy {
  hero: {
    badge: string;
    heading: string;
    description: string;
  };
  actions: {
    refresh: string;
  };
  empty: {
    heading: string;
    description: string;
    upload: string;
  };
  unauthenticated: {
    heading: string;
    description: string;
    login: string;
    signup: string;
  };
  highlightsLabel: string;
  untitled: string;
}

export default function ReportsPageContent() {
  const { user, refreshHistory } = useAuth();
  const { language, getCopy, t } = useLanguage();
  const copy = getCopy<ReportsPageCopy>("reportsPage");
  const [refreshing, setRefreshing] = useState(false);

  const dateFormatter = useMemo(
    () =>
      new Intl.DateTimeFormat(language === "bn" ? "bn-BD" : "en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
      }),
    [language]
  );

  const handleRefresh = useCallback(async () => {
    if (refreshing) return;
    try {
      setRefreshing(true);
      await refreshHistory();
    } finally {
      setRefreshing(false);
    }
  }, [refreshHistory, refreshing]);

  if (!user) {
    return <UnauthenticatedPanel copy={copy} />;
  }

  const reportCountKey = user.history.length === 1 ? "single" : "plural";
  const reportCountLabel = t(`account.reports.count.${reportCountKey}`, {
    count: user.history.length,
  });

  return (
    <section className="space-y-8">
      <header className="rounded-4xl border border-slate-100 bg-white p-8 shadow-soft">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
          {copy.hero.badge}
        </p>
        <div className="mt-2 flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">{copy.hero.heading}</h1>
            <p className="mt-2 text-sm text-slate-600">{copy.hero.description}</p>
            <p className="mt-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
              {reportCountLabel}
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Link
              href="/upload"
              className="inline-flex items-center justify-center rounded-full bg-brand-gradient px-5 py-2.5 text-sm font-semibold text-white shadow-soft transition hover:-translate-y-0.5 hover:shadow-lg"
            >
              {t("common.actions.newUpload")}
            </Link>
            <button
              type="button"
              onClick={handleRefresh}
              className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-600 transition hover:border-slate-300 hover:text-slate-900 disabled:cursor-progress disabled:opacity-70"
              disabled={refreshing}
            >
              {refreshing ? `${copy.actions.refresh}…` : copy.actions.refresh}
            </button>
          </div>
        </div>
      </header>

      {user.history.length === 0 ? (
        <ReportsEmpty copy={copy} />
      ) : (
        <ReportsGrid
          entries={user.history}
          highlightsLabel={copy.highlightsLabel}
          untitledLabel={copy.untitled}
          dateFormatter={dateFormatter}
          t={t}
        />
      )}
    </section>
  );
}

function ReportsGrid({
  entries,
  highlightsLabel,
  untitledLabel,
  dateFormatter,
  t,
}: {
  entries: HistoryEntry[];
  highlightsLabel: string;
  untitledLabel: string;
  dateFormatter: Intl.DateTimeFormat;
  t: ReturnType<typeof useLanguage>["t"];
}) {
  return (
    <div className="grid gap-5 md:grid-cols-2">
      {entries.map((entry) => {
        const analyzedLabel = t("reportsPage.analyzedOn", {
          date: dateFormatter.format(new Date(entry.date)),
        });
        const alertsLabel = t("account.reports.alerts", {
          count: entry.highlights.length,
        });
        return (
          <article
            key={entry.id}
            className="flex h-full flex-col justify-between rounded-3xl border border-slate-100 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
          >
            <div>
              <div className="flex items-center justify-between gap-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                  {analyzedLabel}
                </p>
                <span className="rounded-full bg-brand-gradient-soft px-3 py-1 text-xs font-semibold text-slate-700">
                  {alertsLabel}
                </span>
              </div>
              <h3 className="mt-2 text-lg font-semibold text-slate-900">
                {entry.title || untitledLabel}
              </h3>
              {entry.summary && (
                <p className="mt-2 text-sm text-slate-600">{entry.summary}</p>
              )}
            </div>
            {entry.highlights.length > 0 && (
              <div className="mt-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                  {highlightsLabel}
                </p>
                <ul className="mt-2 space-y-2 text-sm text-slate-600">
                  {entry.highlights.map((highlight, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="mt-1 h-1.5 w-1.5 rounded-full bg-brand-gradient" />
                      <span>{highlight}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            <div className="mt-6">
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
  );
}

function ReportsEmpty({ copy }: { copy: ReportsPageCopy }) {
  return (
    <div className="rounded-4xl border border-dashed border-slate-200 bg-white p-10 text-center shadow-sm">
      <h2 className="text-2xl font-semibold text-slate-900">{copy.empty.heading}</h2>
      <p className="mt-3 text-sm text-slate-600">{copy.empty.description}</p>
      <Link
        href="/upload"
        className="mt-6 inline-flex items-center justify-center rounded-full bg-brand-gradient px-5 py-2.5 text-sm font-semibold text-white shadow-soft transition hover:-translate-y-0.5 hover:shadow-lg"
      >
        {copy.empty.upload}
      </Link>
    </div>
  );
}

function UnauthenticatedPanel({ copy }: { copy: ReportsPageCopy }) {
  return (
    <section className="mx-auto max-w-3xl rounded-4xl border border-slate-100 bg-white p-10 text-center shadow-soft">
      <h1 className="text-3xl font-bold text-slate-900">{copy.unauthenticated.heading}</h1>
      <p className="mt-3 text-sm text-slate-600">{copy.unauthenticated.description}</p>
      <div className="mt-6 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
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
          {copy.unauthenticated.signup}
        </Link>
      </div>
    </section>
  );
}

