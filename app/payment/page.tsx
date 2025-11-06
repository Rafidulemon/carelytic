'use client';

import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { useAuth } from "@/components/AuthProvider";
import { useSubscriptionPlans, type SubscriptionPlanInfo } from "@/components/subscriptionPlans";
import { useLanguage } from "@/components/LanguageProvider";
import { useState } from "react";

const PAYMENT_OPTION_IDS = ["bkash", "nagad", "card"] as const;

type PaymentOptionId = (typeof PAYMENT_OPTION_IDS)[number];

interface PaymentCopy {
  hero: {
    badge: string;
    heading: string;
    description: string;
    balanceLabel: string;
    planLabel: string;
    guestLabel: string;
    saveCallout: {
      title: string;
      message: string;
    };
  };
  paymentOptions: Record<PaymentOptionId, { label: string; description: string }>;
  payg: {
    heading: string;
    description: string;
    status: {
      processingCard: string;
      redirecting: string;
      loginRequired: string;
      success: string;
    };
    note: string;
  };
  subscriptions: {
    heading: string;
    description: string;
    includes: string;
    includesNone: string;
    buy: string;
    currentPlan: string;
    choosePlan: string;
    statusProcessing: string;
    statusSuccess: string;
    note: string;
  };
  faq: {
    heading: string;
    items: { question: string; answer: string }[];
  };
}

export default function PaymentPage() {
  return (
    <div className="min-h-screen bg-slate-50/80">
      <Navbar />
      <main className="mx-auto max-w-6xl px-6 pb-24 pt-16 lg:px-8 lg:pt-20">
        <Hero />
        <PayAsYouGo />
        <Subscriptions />
        <FAQ />
      </main>
      <Footer />
    </div>
  );
}

function usePaymentCopy() {
  const { getCopy } = useLanguage();
  return getCopy<PaymentCopy>("payment");
}

function Hero() {
  const { user } = useAuth();
  const payment = usePaymentCopy();
  const plans = useSubscriptionPlans();
  const { t } = useLanguage();
  const creditsLabel = t("common.credits.label");

  const currentPlanTitle = user
    ? plans.find((plan) => plan.id === user.subscriptionPlan)?.title ?? t("plans.payg.title")
    : payment.hero.guestLabel;

  return (
    <section className="rounded-4xl border border-slate-100 bg-white p-8 shadow-soft sm:p-12">
      <span className="text-xs font-semibold uppercase tracking-wide text-slate-400">{payment.hero.badge}</span>
      <h1 className="mt-4 text-3xl font-bold text-slate-900 sm:text-4xl">{payment.hero.heading}</h1>
      <p
        className="mt-3 max-w-2xl text-sm text-slate-600 sm:text-base"
        dangerouslySetInnerHTML={{ __html: payment.hero.description }}
      />
      <div className="mt-6 flex flex-wrap items-center gap-4">
        <div className="rounded-3xl border border-slate-100 bg-slate-50/70 px-6 py-4 text-sm text-slate-600">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            {payment.hero.balanceLabel}
          </p>
          <p className="mt-1 text-2xl font-bold text-slate-900">
            {user ? user.credits : 0}
            <span className="ml-1 text-sm font-semibold text-slate-500">{creditsLabel}</span>
          </p>
          <p className="mt-1 text-xs text-slate-500">
            {payment.hero.planLabel}: <span className="font-semibold text-slate-700">{currentPlanTitle}</span>
          </p>
        </div>
        <div className="rounded-3xl border border-emerald-100 bg-emerald-50 px-6 py-4 text-sm text-emerald-700">
          <p className="text-xs font-semibold uppercase tracking-wide">{payment.hero.saveCallout.title}</p>
          <p className="mt-1">{payment.hero.saveCallout.message}</p>
        </div>
      </div>
    </section>
  );
}

function PayAsYouGo() {
  const { user } = useAuth();
  const payment = usePaymentCopy();
  const { t } = useLanguage();
  const options = PAYMENT_OPTION_IDS.map((id) => ({ id, ...payment.paymentOptions[id] }));
  const [status, setStatus] = useState<"idle" | "processing" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const handlePay = (method: PaymentOptionId) => {
    setStatus("processing");
    if (method === "card") {
      setMessage(payment.payg.status.processingCard);
    } else {
      const methodLabel = payment.paymentOptions[method].label;
      setMessage(t("payment.payg.status.redirecting", { method: methodLabel }));
    }
    setTimeout(() => {
      if (!user) {
        setStatus("error");
        setMessage(payment.payg.status.loginRequired);
        return;
      }
      setStatus("success");
      setMessage(payment.payg.status.success);
    }, 1400);
  };

  const messageClass =
    status === "success" ? "text-emerald-600" : status === "processing" ? "text-slate-500" : "text-rose-600";

  return (
    <section className="mt-12 rounded-4xl border border-slate-100 bg-white p-8 shadow-sm">
      <h2 className="text-2xl font-bold text-slate-900">{payment.payg.heading}</h2>
      <p
        className="mt-2 text-sm text-slate-600"
        dangerouslySetInnerHTML={{ __html: payment.payg.description }}
      />
      <div className="mt-6 grid gap-4 md:grid-cols-3">
        {options.map((option) => (
          <article
            key={option.id}
            className="flex h-full flex-col justify-between rounded-3xl border border-slate-100 bg-slate-50/70 p-5 transition hover:-translate-y-1 hover:border-transparent hover:bg-white hover:shadow-lg"
          >
            <div>
              <p className="text-sm font-semibold text-slate-900">{option.label}</p>
              <p className="mt-2 text-sm text-slate-600">{option.description}</p>
            </div>
            <button
              type="button"
              onClick={() => handlePay(option.id)}
              className="mt-4 rounded-full bg-brand-gradient px-4 py-2 text-sm font-semibold text-white shadow-soft transition hover:-translate-y-0.5 hover:shadow-lg"
            >
              {option.label}
            </button>
          </article>
        ))}
      </div>
      {message && (
        <p className={`mt-4 text-sm font-semibold ${messageClass}`}>
          {message}
        </p>
      )}
      <p className="mt-2 text-xs text-slate-500">{payment.payg.note}</p>
    </section>
  );
}

function Subscriptions() {
  const { user, purchaseSubscription } = useAuth();
  const payment = usePaymentCopy();
  const { t } = useLanguage();
  const plans = useSubscriptionPlans();
  const [status, setStatus] = useState<"idle" | "processing" | "success">("idle");
  const [message, setMessage] = useState("");

  const handlePurchase = (planId: SubscriptionPlanInfo["id"]) => {
    setStatus("processing");
    setMessage(payment.subscriptions.statusProcessing);
    setTimeout(() => {
      purchaseSubscription(planId);
      const selected = plans.find((plan) => plan.id === planId);
      setStatus("success");
      setMessage(t("payment.subscriptions.statusSuccess", { credits: selected?.credits ?? 0 }));
    }, 1400);
  };

  return (
    <section className="mt-12 rounded-4xl border border-slate-100 bg-white p-8 shadow-sm">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">{payment.subscriptions.heading}</h2>
          <p
            className="mt-2 text-sm text-slate-600"
            dangerouslySetInnerHTML={{ __html: payment.subscriptions.description }}
          />
        </div>
      </div>
      <div className="mt-6 grid gap-4 md:grid-cols-3">
        {plans.map((plan) => {
          const isActive = user?.subscriptionPlan === plan.id;
          const [includesPrefix = "", includesSuffix = ""] = payment.subscriptions.includes.split("{{credits}}");
          const buttonLabel = isActive
            ? payment.subscriptions.currentPlan
            : t("payment.subscriptions.buy", { plan: plan.title });

          return (
            <article
              key={plan.id}
              className={`flex h-full flex-col rounded-3xl border p-6 transition ${
                isActive
                  ? "border-brand-gradient bg-brand-gradient-soft"
                  : "border-slate-100 bg-slate-50/70 hover:-translate-y-1 hover:border-transparent hover:bg-white hover:shadow-lg"
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
                  {includesPrefix}
                  <span className="font-bold text-slate-900">
                    {plan.credits ? `${plan.credits}${includesSuffix}` : payment.subscriptions.includesNone}
                  </span>
                </p>
                <button
                  type="button"
                  onClick={() => handlePurchase(plan.id)}
                  className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                    isActive
                      ? "bg-brand-gradient text-white shadow-soft"
                      : "border border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:text-slate-900"
                  }`}
                >
                  {buttonLabel}
                </button>
              </div>
            </article>
          );
        })}
      </div>
      {message && (
        <p className={`mt-4 text-sm font-semibold ${status === "success" ? "text-emerald-600" : "text-slate-500"}`}>
          {message}
        </p>
      )}
      <p className="mt-2 text-xs text-slate-500">{payment.subscriptions.note}</p>
    </section>
  );
}

function FAQ() {
  const payment = usePaymentCopy();
  return (
    <section className="mt-12 rounded-4xl border border-slate-100 bg-white p-8 shadow-sm">
      <h2 className="text-2xl font-bold text-slate-900">{payment.faq.heading}</h2>
      <div className="mt-6 grid gap-4 md:grid-cols-2">
        {payment.faq.items.map((item) => (
          <FaqItem key={item.question} question={item.question} answer={item.answer} />
        ))}
      </div>
    </section>
  );
}

function FaqItem({ question, answer }: { question: string; answer: string }) {
  return (
    <div className="rounded-3xl border border-slate-100 bg-slate-50/70 p-5">
      <h3 className="text-sm font-semibold text-slate-900">{question}</h3>
      <p className="mt-2 text-sm text-slate-600">{answer}</p>
    </div>
  );
}
