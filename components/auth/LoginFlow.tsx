"use client";

import { useAuth } from "@/components/AuthProvider";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

const OTP_LENGTH = 6;

function normalizeBangladeshPhone(phone: string) {
  const digits = phone.replace(/[^\d]/g, "");
  if (digits.startsWith("8801") && digits.length >= 13) {
    return `+${digits.slice(0, 13)}`;
  }
  if (digits.startsWith("01") && digits.length >= 11) {
    return `+880${digits.slice(1, 11)}`;
  }
  if (digits.startsWith("1") && digits.length >= 10) {
    return `+880${digits.slice(0, 10)}`;
  }
  return null;
}

export default function LoginFlow() {
  const { user, login } = useAuth();
  const router = useRouter();
  const [step, setStep] = useState<"phone" | "otp">("phone");
  const [phone, setPhone] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [normalizedPhone, setNormalizedPhone] = useState("");
  const [otpValues, setOtpValues] = useState(Array(OTP_LENGTH).fill(""));
  const [otpError, setOtpError] = useState("");
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(60);
  const inputRefs = useRef<Array<HTMLInputElement | null>>([]);

  useEffect(() => {
    if (user) {
      router.replace("/account");
    }
  }, [router, user]);

  useEffect(() => {
    if (step !== "otp" || timer === 0) {
      return;
    }
    const countdown = setInterval(() => setTimer((value) => Math.max(0, value - 1)), 1000);
    return () => clearInterval(countdown);
  }, [step, timer]);

  const handleSendOtp = () => {
    const normalized = normalizeBangladeshPhone(phone.trim());
    if (!normalized) {
      setPhoneError("Enter a valid Bangladeshi phone number (e.g. 017XXXXXXXX).");
      return;
    }
    setPhoneError("");
    setNormalizedPhone(normalized);
    setOtpError("");
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setTimer(60);
      setStep("otp");
      setOtpValues(Array(OTP_LENGTH).fill(""));
      setTimeout(() => {
        inputRefs.current[0]?.focus();
      }, 100);
    }, 900);
  };

  const handleOtpChange = (index: number, value: string) => {
    if (!/^\d?$/.test(value)) {
      return;
    }
    const next = [...otpValues];
    next[index] = value;
    setOtpValues(next);
    setOtpError("");

    if (value && index < OTP_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }
    if (!value && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleOtpPaste = (event: React.ClipboardEvent<HTMLInputElement>) => {
    const text = event.clipboardData.getData("text").trim();
    if (!/^\d{6}$/.test(text)) {
      return;
    }
    const digits = text.split("");
    setOtpValues(digits);
    setTimeout(() => inputRefs.current[OTP_LENGTH - 1]?.focus(), 50);
  };

  const handleVerifyOtp = () => {
    const code = otpValues.join("");
    if (code.length !== OTP_LENGTH) {
      setOtpError("Enter the six-digit code sent to your phone.");
      return;
    }
    if (!normalizedPhone) {
      setOtpError("Resend the OTP to continue.");
      return;
    }
    setLoading(true);
    setTimeout(() => {
      login({ phone: normalizedPhone });
      router.replace("/account");
    }, 900);
  };

  return (
    <section className="relative mx-auto max-w-4xl overflow-hidden rounded-4xl border border-slate-100 bg-white shadow-soft">
      <div className="grid gap-0 lg:grid-cols-[1.2fr_1fr]">
        <div className="p-8 sm:p-12">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            Secure login
          </div>
          <h1 className="mt-4 text-3xl font-bold text-slate-900 sm:text-4xl">
            Welcome back to Carelytic
          </h1>
          <p className="mt-2 text-sm text-slate-600 sm:text-base">
            Sign in with the Bangladeshi mobile number linked to your Carelytic account. We&apos;ll send a one-time
            passcode (OTP) for secure verification.
          </p>

          {step === "phone" && (
            <form
              className="mt-10 space-y-5"
              onSubmit={(event) => {
                event.preventDefault();
                handleSendOtp();
              }}
            >
              <div>
                <label className="text-sm font-semibold text-slate-700">Bangladeshi phone number</label>
                <div className="mt-2 flex items-center rounded-2xl border border-slate-200 bg-slate-50/80 px-4 py-3 focus-within:border-slate-300 focus-within:bg-white focus-within:ring-2 focus-within:ring-slate-200">
                  <span className="mr-2 text-sm font-semibold text-slate-500">+880</span>
                  <input
                    type="tel"
                    inputMode="tel"
                    className="w-full border-0 bg-transparent text-base font-medium text-slate-800 outline-none"
                    placeholder="17XXXXXXX"
                    value={phone}
                    onChange={(event) => setPhone(event.target.value)}
                  />
                </div>
                {phoneError && <p className="mt-2 text-sm text-rose-500">{phoneError}</p>}
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-full bg-brand-gradient px-6 py-3 text-sm font-semibold text-white shadow-soft transition hover:-translate-y-0.5 hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-70"
              >
                {loading ? "Sending code..." : "Send OTP"}
              </button>
              <p className="text-center text-xs text-slate-500">
                New to Carelytic?{" "}
                <Link href="/signup" className="font-semibold text-slate-900 hover:underline">
                  Create an account
                </Link>
              </p>
            </form>
          )}

          {step === "otp" && (
            <form
              className="mt-10 space-y-6"
              onSubmit={(event) => {
                event.preventDefault();
                handleVerifyOtp();
              }}
            >
              <div className="rounded-3xl border border-slate-100 bg-slate-50/70 p-4">
                <p className="text-sm font-semibold text-slate-700">OTP sent to:</p>
                <p className="mt-1 text-lg font-semibold text-slate-900">{normalizedPhone}</p>
                <p className="mt-2 text-xs text-slate-500">
                  Didn&apos;t get it? You can request a new code in{" "}
                  <span className="font-semibold text-slate-700">{timer}s</span>.
                </p>
              </div>
              <div>
                <label className="text-sm font-semibold text-slate-700">Enter 6-digit code</label>
                <div className="mt-3 flex justify-between gap-2 sm:gap-3">
                  {otpValues.map((value, index) => (
                    <input
                      key={index}
                      ref={(element) => {
                        inputRefs.current[index] = element;
                      }}
                      type="tel"
                      inputMode="numeric"
                      maxLength={1}
                      className="h-12 w-full rounded-2xl border border-slate-200 text-center text-lg font-semibold text-slate-900 shadow-sm focus:border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-200"
                      value={value}
                      onChange={(event) => handleOtpChange(index, event.target.value)}
                      onPaste={handleOtpPaste}
                    />
                  ))}
                </div>
                {otpError && <p className="mt-2 text-sm text-rose-500">{otpError}</p>}
              </div>
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <button
                  type="button"
                  className="w-full rounded-full border border-slate-200 px-6 py-3 text-sm font-semibold text-slate-600 transition hover:border-slate-300 hover:text-slate-900 sm:w-auto"
                  onClick={() => {
                    setStep("phone");
                    setOtpValues(Array(OTP_LENGTH).fill(""));
                    setNormalizedPhone("");
                    setTimer(60);
                  }}
                >
                  Edit number
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full rounded-full bg-brand-gradient px-6 py-3 text-sm font-semibold text-white shadow-soft transition hover:-translate-y-0.5 hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-70 sm:w-auto"
                >
                  {loading ? "Verifying..." : "Verify & continue"}
                </button>
              </div>
              <div className="text-center text-xs text-slate-500">
                Still no code?{" "}
                <button
                  type="button"
                  disabled={timer > 0}
                  onClick={handleSendOtp}
                  className="font-semibold text-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Resend OTP
                </button>
              </div>
            </form>
          )}
        </div>
        <div className="relative hidden min-h-full flex-col justify-between bg-brand-gradient p-10 text-white lg:flex">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-white/80">Carelytic secure access</p>
            <h2 className="mt-4 text-3xl font-bold leading-tight">
              Clinical-grade insight with patient-first security
            </h2>
            <p className="mt-3 text-sm text-white/70">
              Your reports and health interpretations stay encrypted and compliant with Bangladeshi health data
              standards. Every session uses OTP verification for peace of mind.
            </p>
          </div>
          <div className="rounded-3xl bg-white/15 p-4 backdrop-blur">
            <p className="text-xs uppercase tracking-wide text-white/70">Why OTP?</p>
            <p className="mt-2 text-sm text-white">
              2-step verification keeps your Carelytic insights private and ensures only you can access your medical
              history.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
