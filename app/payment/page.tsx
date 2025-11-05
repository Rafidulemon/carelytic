'use client';

import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { useAuth } from "@/components/AuthProvider";
import { subscriptionPlans } from "@/components/subscriptionPlans";
import { useState } from "react";

const PAYMENT_OPTIONS = [
  { id: "bkash", label: "bKash", description: "Instant mobile payment via bKash personal or merchant accounts." },
  { id: "nagad", label: "Nagad", description: "Pay using your Nagad wallet with one-tap confirmation." },
  { id: "card", label: "Debit/Credit Card", description: "Visa, Mastercard, and local cards accepted." },
];

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

function Hero() {
  const { user } = useAuth();
  return (
    <section className="rounded-4xl border border-slate-100 bg-white p-8 shadow-soft sm:p-12">
      <span className="text-xs font-semibold uppercase tracking-wide text-slate-400">Payments & pricing</span>
      <h1 className="mt-4 text-3xl font-bold text-slate-900 sm:text-4xl">
        Unlock insights with simple, transparent pricing
      </h1>
      <p className="mt-3 max-w-2xl text-sm text-slate-600 sm:text-base">
        Every report costs <strong>BDT 10</strong> (or <strong>10 credits</strong>). Top up with monthly or yearly
        subscriptions to save 20% and get instant access to Carelytic&apos;s AI interpretations.
      </p>
      <div className="mt-6 flex flex-wrap items-center gap-4">
        <div className="rounded-3xl border border-slate-100 bg-slate-50/70 px-6 py-4 text-sm text-slate-600">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Your current balance</p>
          <p className="mt-1 text-2xl font-bold text-slate-900">
            {user ? user.credits : 0}
            <span className="ml-1 text-sm font-semibold text-slate-500">credits</span>
          </p>
          <p className="mt-1 text-xs text-slate-500">
            Plan:{" "}
            <span className="font-semibold text-slate-700">
              {user ? subscriptionPlans.find((plan) => plan.id === user.subscriptionPlan)?.title ?? "Pay as you go" : "Guest"}
            </span>
          </p>
        </div>
        <div className="rounded-3xl border border-emerald-100 bg-emerald-50 px-6 py-4 text-sm text-emerald-700">
          <p className="text-xs font-semibold uppercase tracking-wide">Save with subscriptions</p>
          <p className="mt-1">
            Monthly plan: BDT 100 → 120 credits &nbsp;|&nbsp; Yearly plan: BDT 1,000 → 1,500 credits
          </p>
        </div>
      </div>
    </section>
  );
}

function PayAsYouGo() {
  const { user } = useAuth();
  const [status, setStatus] = useState<"idle" | "processing" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const handlePay = (method: "bkash" | "nagad" | "card") => {
    setStatus("processing");
    setMessage(
      method === "card"
        ? "Processing secure card payment..."
        : `Redirecting to ${method === "bkash" ? "bKash" : "Nagad"} checkout...`
    );
    setTimeout(() => {
      if (!user) {
        setStatus("error");
        setMessage("Please log in to complete payment and have credits automatically applied.");
        return;
      }
      setStatus("success");
      setMessage("Payment successful! Your report will unlock automatically after processing.");
    }, 1400);
  };

  return (
    <section className="mt-12 rounded-4xl border border-slate-100 bg-white p-8 shadow-sm">
      <h2 className="text-2xl font-bold text-slate-900">Pay as you go</h2>
      <p className="mt-2 text-sm text-slate-600">
        Ideal for ad-hoc uploads. Each unlocked report costs <strong>BDT 10</strong>. Choose your preferred Bangladeshi
        payment method below.
      </p>
      <div className="mt-6 grid gap-4 md:grid-cols-3">
        {PAYMENT_OPTIONS.map((option) => (
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
              onClick={() => handlePay(option.id as "bkash" | "nagad" | "card")}
              className="mt-4 rounded-full bg-brand-gradient px-4 py-2 text-sm font-semibold text-white shadow-soft transition hover:-translate-y-0.5 hover:shadow-lg"
            >
              Pay BDT 10
            </button>
          </article>
        ))}
      </div>
      {message && (
        <p
          className={`mt-4 text-sm font-semibold ${
            status === "success" ? "text-emerald-600" : status === "processing" ? "text-slate-500" : "text-rose-600"
          }`}
        >
          {message}
        </p>
      )}
      <p className="mt-2 text-xs text-slate-500">
        After successful payment, you&apos;ll be redirected back to Carelytic and your report unlocks instantly.
      </p>
    </section>
  );
}

function Subscriptions() {
  const { user, purchaseSubscription } = useAuth();
  const [status, setStatus] = useState<"idle" | "processing" | "success">("idle");
  const [message, setMessage] = useState("");

  const handlePurchase = (planId: (typeof subscriptionPlans)[number]["id"]) => {
    setStatus("processing");
    setMessage("Preparing secure payment checkout...");
    setTimeout(() => {
      purchaseSubscription(planId);
      const selected = subscriptionPlans.find((plan) => plan.id === planId);
      setStatus("success");
      setMessage(
        `Subscription activated! ${selected?.credits ?? 0} credits added to your balance. Your plan renews automatically.`
      );
    }, 1400);
  };

  return (
    <section className="mt-12 rounded-4xl border border-slate-100 bg-white p-8 shadow-sm">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Subscription bundles</h2>
          <p className="mt-2 text-sm text-slate-600">
            Save 20% compared to pay-as-you-go. Subscribers receive credits up front and redeem <strong>10 credits</strong>{" "}
            per report. Plans renew automatically; cancel anytime.
          </p>
        </div>
      </div>
      <div className="mt-6 grid gap-4 md:grid-cols-3">
        {subscriptionPlans.map((plan) => {
          const isActive = user?.subscriptionPlan === plan.id;
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
                  Includes{" "}
                  <span className="font-bold text-slate-900">
                    {plan.credits ? `${plan.credits} credits` : "no prepaid credits"}
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
                  {isActive ? "Current plan" : `Buy ${plan.title}`}
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
      <p className="mt-2 text-xs text-slate-500">
        Credits renew when your subscription is charged. Yearly plans provide the biggest upfront credit bundle for clinics
        and high-volume users.
      </p>
    </section>
  );
}

function FAQ() {
  return (
    <section className="mt-12 rounded-4xl border border-slate-100 bg-white p-8 shadow-sm">
      <h2 className="text-2xl font-bold text-slate-900">Payment FAQs</h2>
      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <FaqItem
          question="Can I mix pay-as-you-go and credits?"
          answer="Yes. You can pay BDT 10 at any time, and also maintain a subscription for steady savings. Credits only deduct when available."
        />
        <FaqItem
          question="What happens if I cancel my subscription?"
          answer="You keep any remaining credits until they expire (90 days for monthly, 180 days for yearly). Future renewals stop immediately."
        />
        <FaqItem
          question="Do credits roll over?"
          answer="Monthly credits roll forward for 90 days, yearly credits for 180 days. After that, unused credits expire."
        />
        <FaqItem
          question="How soon is my report unlocked?"
          answer="Instantly. As soon as payment is confirmed or credits are redeemed, your report summary becomes available."
        />
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
