"use client";

import { useAuth } from "@/components/AuthProvider";
import type { BloodGroup } from "@/components/AuthProvider";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { useLanguage } from "@/components/LanguageProvider";

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

interface SignupCopy {
  badge: string;
  heading: string;
  intro: string;
  progress: string;
  phone: {
    label: string;
    placeholder: string;
    errorInvalid: string;
    send: string;
    sending: string;
    cta: string;
    loginLink: string;
  };
  otp: {
    heading: string;
    resendInfo: string;
    label: string;
    edit: string;
    verify: string;
    verifying: string;
    resendCta: string;
    resend: string;
    errorCode: string;
  };
  details: {
    fullName: { label: string; placeholder: string; error: string };
    email: { label: string; placeholder: string; error: string };
    bloodGroup: { label: string; placeholder: string; error: string };
    password: {
      label: string;
      placeholder: string;
      helper: string;
      confirmLabel: string;
      confirmPlaceholder: string;
      errorLength: string;
      errorMismatch: string;
    };
    diabetic: { label: string; yes: string; no: string };
    hypertension: { label: string; yes: string; no: string };
    conditionsError: string;
    healthNote: string;
    consent: { text: string; error: string };
    verifyPhoneError: string;
  };
  buttons: {
    back: string;
    create: string;
    creating: string;
  };
  sidebar: {
    badge: string;
    heading: string;
    body: string;
    featuresTitle: string;
    features: string[];
  };
}

export default function SignupFlow() {
  const { user, completeSignup } = useAuth();
  const router = useRouter();
  const { getCopy } = useLanguage();
  const signup = getCopy<SignupCopy>("signup");
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
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [detailsError, setDetailsError] = useState("");
  const inputRefs = useRef<Array<HTMLInputElement | null>>([]);

  useEffect(() => {
    if (user) {
      router.replace("/account");
    }
  }, [router, user]);

  useEffect(() => {
    if (step !== "otp" || timer === 0) return;
    const countdown = setInterval(
      () => setTimer((value) => Math.max(0, value - 1)),
      1000
    );
    return () => clearInterval(countdown);
  }, [step, timer]);

  const handleSendOtp = () => {
    const normalized = normalizeBangladeshPhone(phone.trim());
    if (!normalized) {
      setPhoneError(signup.phone.errorInvalid);
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
      setOtpError(signup.otp.errorCode);
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
      setDetailsError(signup.details.fullName.error);
      return;
    }
    if (email && !EMAIL_REGEX.test(email.trim())) {
      setDetailsError(signup.details.email.error);
      return;
    }
    if (!consent) {
      setDetailsError(signup.details.consent.error);
      return;
    }
    if (!normalizedPhone) {
      setDetailsError(signup.details.verifyPhoneError);
      return;
    }
    if (password.trim().length < 6) {
      setDetailsError(signup.details.password.errorLength);
      return;
    }
    if (password !== confirmPassword) {
      setDetailsError(signup.details.password.errorMismatch);
      return;
    }
    if (!bloodGroup) {
      setDetailsError(signup.details.bloodGroup.error);
      return;
    }
    if (isDiabetic === null || hasHypertension === null) {
      setDetailsError(signup.details.conditionsError);
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
        subscriptionPlan: "payg",
        credits: 0,
        password,
      });

      router.replace("/account");
    }, 900);
  };

  const progressPercent = useMemo(() => {
    if (step === "phone") return 33;
    if (step === "otp") return 66;
    return 100;
  }, [step]);

  const otpResendParts = signup.otp.resendInfo.split("{{seconds}}");

  const consentNodes = buildConsentNodes(signup.details.consent.text);

  return (
    <section className="relative mx-auto max-w-5xl overflow-hidden rounded-4xl border border-slate-100 bg-white shadow-soft">
      <div className="grid gap-0 lg:grid-cols-[1.2fr_1fr]">
        <div className="p-8 sm:p-12">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
            <span className="h-2 w-2 rounded-full bg-brand-gradient" />
            {signup.badge}
          </div>
          <h1 className="mt-4 text-3xl font-bold text-slate-900 sm:text-4xl">
            {signup.heading}
          </h1>
          <p className="mt-2 text-sm text-slate-600 sm:text-base">
            {signup.intro}
          </p>

          <div className="mt-8">
            <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wide text-slate-400">
              <span>{signup.progress}</span>
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
                <label className="text-sm font-semibold text-slate-700">
                  {signup.phone.label}
                </label>
                <div className="mt-2 flex items-center rounded-2xl border border-slate-200 bg-slate-50/80 px-4 py-3 focus-within:border-slate-300 focus-within:bg-white focus-within:ring-2 focus-within:ring-slate-200">
                  <span className="mr-2 text-sm font-semibold text-slate-500">
                    +880
                  </span>
                  <input
                    type="tel"
                    inputMode="tel"
                    className="w-full border-0 bg-transparent text-base font-medium text-slate-800 outline-none"
                    placeholder={signup.phone.placeholder}
                    value={phone}
                    onChange={(event) => setPhone(event.target.value)}
                  />
                </div>
                {phoneError && (
                  <p className="mt-2 text-sm text-rose-500">{phoneError}</p>
                )}
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-full bg-brand-gradient px-6 py-3 text-sm font-semibold text-white shadow-soft transition hover:-translate-y-0.5 hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-70"
              >
                {loading ? signup.phone.sending : signup.phone.send}
              </button>
              <p className="text-center text-xs text-slate-500">
                {signup.phone.cta}{" "}
                <Link
                  href="/login"
                  className="font-semibold text-slate-900 hover:underline"
                >
                  {signup.phone.loginLink}
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
                <p className="text-sm font-semibold text-slate-700">
                  {signup.otp.heading}
                </p>
                <p className="mt-1 text-lg font-semibold text-slate-900">
                  {normalizedPhone}
                </p>
                <p className="mt-2 text-xs text-slate-500">
                  {otpResendParts[0]}
                  <span className="font-semibold text-slate-700">{timer}</span>
                  {otpResendParts[1] ?? ""}
                </p>
              </div>
              <div>
                <label className="text-sm font-semibold text-slate-700">
                  {signup.otp.label}
                </label>
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
                      onChange={(event) =>
                        handleOtpChange(index, event.target.value)
                      }
                      onPaste={handleOtpPaste}
                    />
                  ))}
                </div>
                {otpError && (
                  <p className="mt-2 text-sm text-rose-500">{otpError}</p>
                )}
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
                  {signup.otp.edit}
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full rounded-full bg-brand-gradient px-6 py-3 text-sm font-semibold text-white shadow-soft transition hover:-translate-y-0.5 hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-70 sm:w-auto"
                >
                  {loading ? signup.otp.verifying : signup.otp.verify}
                </button>
              </div>
              <div className="text-center text-xs text-slate-500">
                {signup.otp.resendCta}{" "}
                <button
                  type="button"
                  disabled={timer > 0}
                  onClick={handleSendOtp}
                  className="font-semibold text-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {signup.otp.resend}
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
                  <label className="text-sm font-semibold text-slate-700">
                    {signup.details.fullName.label}
                  </label>
                  <input
                    type="text"
                    className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-base font-medium text-slate-800 outline-none focus:border-slate-300 focus:ring-2 focus:ring-slate-200"
                    placeholder={signup.details.fullName.placeholder}
                    value={fullName}
                    onChange={(event) => setFullName(event.target.value)}
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="text-sm font-semibold text-slate-700">
                    {signup.details.email.label}
                  </label>
                  <input
                    type="email"
                    className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-base font-medium text-slate-800 outline-none focus:border-slate-300 focus:ring-2 focus:ring-slate-200"
                    placeholder={signup.details.email.placeholder}
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                  />
                </div>
                <div>
                  <label className="text-sm font-semibold text-slate-700">
                    {signup.details.bloodGroup.label}
                  </label>
                  <select
                    className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-base font-medium text-slate-800 outline-none focus:border-slate-300 focus:ring-2 focus:ring-slate-200"
                    value={bloodGroup}
                    onChange={(event) =>
                      setBloodGroup(event.target.value as BloodGroup | "")
                    }
                  >
                    <option value="">
                      {signup.details.bloodGroup.placeholder}
                    </option>
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
            <div>
              <label className="text-sm font-semibold text-slate-700">
                {signup.details.password.label}
              </label>
              <div className="mt-2 flex items-center rounded-2xl border border-slate-200 bg-white px-4 py-3 focus-within:border-slate-300 focus-within:ring-2 focus-within:ring-slate-200">
                <input
                  type={showPassword ? "text" : "password"}
                  className="w-full border-0 bg-transparent text-base font-medium text-slate-800 outline-none"
                  placeholder={signup.details.password.placeholder}
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                />
                <button
                  type="button"
                  className="ml-3 text-xs font-semibold uppercase tracking-wide text-slate-500 transition hover:text-slate-700"
                  onClick={() => setShowPassword((prev) => !prev)}
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
              <p className="mt-2 text-xs text-slate-500">
                {signup.details.password.helper}
              </p>
            </div>
            <div>
              <label className="text-sm font-semibold text-slate-700">
                {signup.details.password.confirmLabel}
              </label>
              <div className="mt-2 flex items-center rounded-2xl border border-slate-200 bg-white px-4 py-3 focus-within:border-slate-300 focus-within:ring-2 focus-within:ring-slate-200">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  className="w-full border-0 bg-transparent text-base font-medium text-slate-800 outline-none"
                  placeholder={signup.details.password.confirmPlaceholder}
                  value={confirmPassword}
                  onChange={(event) => setConfirmPassword(event.target.value)}
                />
                <button
                  type="button"
                  className="ml-3 text-xs font-semibold uppercase tracking-wide text-slate-500 transition hover:text-slate-700"
                  onClick={() => setShowConfirmPassword((prev) => !prev)}
                >
                  {showConfirmPassword ? "Hide" : "Show"}
                </button>
              </div>
            </div>
            <div>
              <label className="text-sm font-semibold text-slate-700">
                {signup.details.diabetic.label}
              </label>
              <div className="mt-2 flex gap-2">
                    <ToggleButton
                      active={isDiabetic === true}
                      onClick={() => setIsDiabetic(true)}
                      label={signup.details.diabetic.yes}
                    />
                    <ToggleButton
                      active={isDiabetic === false}
                      onClick={() => setIsDiabetic(false)}
                      label={signup.details.diabetic.no}
                    />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-semibold text-slate-700">
                    {signup.details.hypertension.label}
                  </label>
                  <div className="mt-2 flex gap-2">
                    <ToggleButton
                      active={hasHypertension === true}
                      onClick={() => setHasHypertension(true)}
                      label={signup.details.hypertension.yes}
                    />
                    <ToggleButton
                      active={hasHypertension === false}
                      onClick={() => setHasHypertension(false)}
                      label={signup.details.hypertension.no}
                    />
                  </div>
                </div>
              </div>
              <p className="text-xs text-slate-500">
                {signup.details.healthNote}
              </p>
              <label className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-slate-50/70 p-4 text-sm text-slate-600 transition hover:border-slate-300 hover:bg-white">
                <input
                  type="checkbox"
                  checked={consent}
                  onChange={(event) => setConsent(event.target.checked)}
                  className="mt-1 h-4 w-4 rounded border-slate-300 accent-[var(--carelytic-blue)] focus:ring-0"
                />
                <span>{consentNodes}</span>
              </label>
              {detailsError && (
                <p className="text-sm text-rose-500">{detailsError}</p>
              )}
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <button
                  type="button"
                  className="w-full rounded-full border border-slate-200 px-6 py-3 text-sm font-semibold text-slate-600 transition hover:border-slate-300 hover:text-slate-900 sm:w-auto"
                  onClick={() => setStep("otp")}
                >
                  {signup.buttons.back}
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full rounded-full bg-brand-gradient px-6 py-3 text-sm font-semibold text-white shadow-soft transition hover:-translate-y-0.5 hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-70 sm:w-auto"
                >
                  {loading ? signup.buttons.creating : signup.buttons.create}
                </button>
              </div>
            </form>
          )}
        </div>
        <div className="relative hidden min-h-full flex-col justify-between bg-brand-gradient p-10 text-white lg:flex">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-white/80">
              {signup.sidebar.badge}
            </p>
            <h2 className="mt-4 text-3xl font-bold leading-tight">
              {signup.sidebar.heading}
            </h2>
            <p className="mt-3 text-sm text-white/70">{signup.sidebar.body}</p>
          </div>
          <div className="space-y-3 rounded-3xl bg-white/15 p-4 backdrop-blur">
            <p className="text-xs uppercase tracking-wide text-white/70">
              {signup.sidebar.featuresTitle}
            </p>
            <ul className="space-y-2 text-sm text-white">
              {signup.sidebar.features.map((item) => (
                <li key={item}>• {item}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

function ToggleButton({
  active,
  onClick,
  label,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex-1 rounded-full border px-3 py-2 text-sm font-semibold transition ${
        active
          ? "border-transparent bg-brand-gradient text-white shadow-soft"
          : "border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:text-slate-900"
      }`}
    >
      {label}
    </button>
  );
}

function buildConsentNodes(text: string) {
  const [beforeTerms, restTerms] = text.split("[terms]");
  if (!restTerms) {
    return text;
  }
  const [termsLabel, afterTermsRaw] = restTerms.split("[/terms]");
  const [between, restPrivacy] = (afterTermsRaw ?? "").split("[privacy]");
  const [privacyLabel, tail] = (restPrivacy ?? "").split("[/privacy]");

  return (
    <>
      {beforeTerms}
      <a href="#" className="font-semibold text-slate-900 hover:underline">
        {termsLabel}
      </a>
      {between}
      <a href="#" className="font-semibold text-slate-900 hover:underline">
        {privacyLabel}
      </a>
      {tail}
    </>
  );
}
