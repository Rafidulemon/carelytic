"use client";

import { useAuth } from "@/components/AuthProvider";
import type { BloodGroup } from "@/components/AuthProvider";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";

const EMAIL_REGEX =
  /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z]{2,})+$/;
const OTP_LENGTH = 6;

type FlowStep = "phone" | "otp" | "details";

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

export default function SignupFlow() {
  const { user, completeSignup } = useAuth();
  const router = useRouter();
  const [step, setStep] = useState<FlowStep>("phone");
  const [phone, setPhone] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [normalizedPhone, setNormalizedPhone] = useState("");
  const [otpValues, setOtpValues] = useState(Array(OTP_LENGTH).fill(""));
  const [otpError, setOtpError] = useState("");
  const [timer, setTimer] = useState(60);
  const [loading, setLoading] = useState(false);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [bloodGroup, setBloodGroup] = useState<BloodGroup | "">("");
  const [isDiabetic, setIsDiabetic] = useState<boolean | null>(null);
  const [hasHypertension, setHasHypertension] = useState<boolean | null>(null);
  const [consent, setConsent] = useState(true);
  const [detailsError, setDetailsError] = useState("");
  const inputRefs = useRef<Array<HTMLInputElement | null>>([]);

  useEffect(() => {
    if (user) {
      router.replace("/account");
    }
  }, [router, user]);

  useEffect(() => {
    if (step !== "otp" || timer === 0) return;
    const countdown = setInterval(() => setTimer((value) => Math.max(0, value - 1)), 1000);
    return () => clearInterval(countdown);
  }, [step, timer]);

  const handleSendOtp = () => {
    const normalized = normalizeBangladeshPhone(phone.trim());
    if (!normalized) {
      setPhoneError("Enter a valid Bangladeshi phone number (e.g. 018XXXXXXXX).");
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
      setTimeout(() => inputRefs.current[0]?.focus(), 100);
    }, 900);
  };

  const handleOtpChange = (index: number, value: string) => {
    if (!/^\d?$/.test(value)) return;
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
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setStep("details");
    }, 900);
  };

  const handleCreateAccount = () => {
    if (fullName.trim().length < 3) {
      setDetailsError("Enter your full name so clinicians know who the report belongs to.");
      return;
    }
    if (email && !EMAIL_REGEX.test(email.trim())) {
      setDetailsError("Enter a valid email address or leave it blank.");
      return;
    }
    if (!consent) {
      setDetailsError("We need your consent to create your Carelytic account.");
      return;
    }
    if (!normalizedPhone) {
      setDetailsError("Please verify your phone number again to finish signing up.");
      return;
    }
    if (!bloodGroup) {
      setDetailsError("Select your blood group so we can personalise your summaries.");
      return;
    }
    if (isDiabetic === null || hasHypertension === null) {
      setDetailsError("Let us know if you have diabetes or high blood pressure. You can update these later.");
      return;
    }
    setDetailsError("");
    setLoading(true);
    setTimeout(() => {
      completeSignup({
        phone: normalizedPhone,
        name: fullName.trim(),
        email: email.trim() || undefined,
        bloodGroup,
        isDiabetic,
        hasHypertension,
      });
      router.replace("/account");
    }, 900);
  };

  const progressPercent = useMemo(() => {
    if (step === "phone") return 33;
    if (step === "otp") return 66;
    return 100;
  }, [step]);

  return (
    <section className="relative mx-auto max-w-5xl overflow-hidden rounded-4xl border border-slate-100 bg-white shadow-soft">
      <div className="grid gap-0 lg:grid-cols-[1.2fr_1fr]">
        <div className="p-8 sm:p-12">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
            <span className="h-2 w-2 rounded-full bg-brand-gradient" />
            Create your Carelytic profile
          </div>
          <h1 className="mt-4 text-3xl font-bold text-slate-900 sm:text-4xl">
            Your AI health companion starts here
          </h1>
          <p className="mt-2 text-sm text-slate-600 sm:text-base">
            Use your Bangladeshi mobile number to get started. We&apos;ll verify it with an OTP and collect a few
            details to personalize your insights.
          </p>

          <div className="mt-8">
            <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wide text-slate-400">
              <span>Progress</span>
              <span>{progressPercent}%</span>
            </div>
            <div className="mt-2 h-2.5 rounded-full bg-slate-100">
              <div
                className="h-full rounded-full bg-brand-gradient transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

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
                    placeholder="19XXXXXXX"
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
                Already have a Carelytic account?{" "}
                <Link href="/login" className="font-semibold text-slate-900 hover:underline">
                  Log in
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
                  Request a fresh code in <span className="font-semibold text-slate-700">{timer}s</span>.
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
                Still waiting?{" "}
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

          {step === "details" && (
            <form
              className="mt-10 space-y-6"
              onSubmit={(event) => {
                event.preventDefault();
                handleCreateAccount();
              }}
            >
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <label className="text-sm font-semibold text-slate-700">Full name</label>
                  <input
                    type="text"
                    className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-base font-medium text-slate-800 outline-none focus:border-slate-300 focus:ring-2 focus:ring-slate-200"
                    placeholder="e.g. Ayesha Rahman"
                    value={fullName}
                    onChange={(event) => setFullName(event.target.value)}
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="text-sm font-semibold text-slate-700">Email (optional)</label>
                  <input
                    type="email"
                    className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-base font-medium text-slate-800 outline-none focus:border-slate-300 focus:ring-2 focus:ring-slate-200"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                  />
                </div>
                <div>
                  <label className="text-sm font-semibold text-slate-700">Blood group</label>
                  <select
                    className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-base font-medium text-slate-800 outline-none focus:border-slate-300 focus:ring-2 focus:ring-slate-200"
                    value={bloodGroup}
                    onChange={(event) => setBloodGroup(event.target.value as BloodGroup)}
                  >
                    <option value="">Select your blood group</option>
                    <option value="A+">A+</option>
                    <option value="A-">A-</option>
                    <option value="B+">B+</option>
                    <option value="B-">B-</option>
                    <option value="AB+">AB+</option>
                    <option value="AB-">AB-</option>
                    <option value="O+">O+</option>
                    <option value="O-">O-</option>
                  </select>
                </div>
                <div className="space-y-3 rounded-2xl border border-slate-200 bg-slate-50/70 p-4">
                  <p className="text-sm font-semibold text-slate-700">Chronic conditions</p>
                  <div className="space-y-2 text-sm text-slate-600">
                    <div className="flex flex-col gap-2">
                      <span className="font-semibold text-slate-700">Diabetes</span>
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => setIsDiabetic(true)}
                          className={`flex-1 rounded-full border px-3 py-2 text-sm font-semibold transition ${
                            isDiabetic === true
                              ? "border-transparent bg-brand-gradient text-white shadow-soft"
                              : "border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:text-slate-900"
                          }`}
                        >
                          Yes
                        </button>
                        <button
                          type="button"
                          onClick={() => setIsDiabetic(false)}
                          className={`flex-1 rounded-full border px-3 py-2 text-sm font-semibold transition ${
                            isDiabetic === false
                              ? "border-transparent bg-brand-gradient text-white shadow-soft"
                              : "border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:text-slate-900"
                          }`}
                        >
                          No
                        </button>
                      </div>
                    </div>
                    <div className="flex flex-col gap-2">
                      <span className="font-semibold text-slate-700">High blood pressure</span>
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => setHasHypertension(true)}
                          className={`flex-1 rounded-full border px-3 py-2 text-sm font-semibold transition ${
                            hasHypertension === true
                              ? "border-transparent bg-brand-gradient text-white shadow-soft"
                              : "border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:text-slate-900"
                          }`}
                        >
                          Yes
                        </button>
                        <button
                          type="button"
                          onClick={() => setHasHypertension(false)}
                          className={`flex-1 rounded-full border px-3 py-2 text-sm font-semibold transition ${
                            hasHypertension === false
                              ? "border-transparent bg-brand-gradient text-white shadow-soft"
                              : "border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:text-slate-900"
                          }`}
                        >
                          No
                        </button>
                      </div>
                    </div>
                  </div>
                  <p className="text-xs text-slate-500">
                    You can add or update more health details anytime from your account.
                  </p>
                </div>
              </div>
              <label className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-slate-50/70 p-4 text-sm text-slate-600 transition hover:border-slate-300 hover:bg-white">
                <input
                  type="checkbox"
                  checked={consent}
                  onChange={(event) => setConsent(event.target.checked)}
                  className="mt-1 h-4 w-4 rounded border-slate-300 accent-[var(--carelytic-blue)] focus:ring-0"
                />
                <span>
                  I agree to Carelytic&apos;s{" "}
                  <a href="#" className="font-semibold text-slate-900 hover:underline">
                    Terms of Service
                  </a>{" "}
                  and{" "}
                  <a href="#" className="font-semibold text-slate-900 hover:underline">
                    Privacy Policy
                  </a>{" "}
                  and confirm that I am the owner of this phone number.
                </span>
              </label>
              {detailsError && <p className="text-sm text-rose-500">{detailsError}</p>}
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <button
                  type="button"
                  className="w-full rounded-full border border-slate-200 px-6 py-3 text-sm font-semibold text-slate-600 transition hover:border-slate-300 hover:text-slate-900 sm:w-auto"
                  onClick={() => setStep("otp")}
                >
                  Back
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full rounded-full bg-brand-gradient px-6 py-3 text-sm font-semibold text-white shadow-soft transition hover:-translate-y-0.5 hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-70 sm:w-auto"
                >
                  {loading ? "Creating..." : "Create account"}
                </button>
              </div>
            </form>
          )}
        </div>
        <div className="relative hidden min-h-full flex-col justify-between bg-brand-gradient p-10 text-white lg:flex">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-white/80">Carelytic onboarding</p>
            <h2 className="mt-4 text-3xl font-bold leading-tight">
              Designed for patients, trusted by clinicians
            </h2>
            <p className="mt-3 text-sm text-white/70">
              We verify every account with mobile OTP to ensure your medical insights stay protected and compliant with
              Bangladeshi data standards.
            </p>
          </div>
          <div className="space-y-3 rounded-3xl bg-white/15 p-4 backdrop-blur">
            <p className="text-xs uppercase tracking-wide text-white/70">What you get</p>
            <ul className="space-y-2 text-sm text-white">
              <li>• Instant AI summaries of lab and imaging reports</li>
              <li>• Trends and alerts tailored to Bangladeshi clinical ranges</li>
              <li>• Shareable insights for your doctor or care circle</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
