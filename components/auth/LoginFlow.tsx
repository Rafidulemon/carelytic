"use client";

import { useAuth } from "@/components/AuthProvider";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useLanguage } from "@/components/LanguageProvider";

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

interface LoginCopy {
  badge: string;
  heading: string;
  intro: string;
  sidebar: {
    title: string;
    headline: string;
    paragraph: string;
    otp: string;
    otpText: string;
  };
  phone: {
    label: string;
    placeholder: string;
    errorInvalid: string;
    send: string;
    sending: string;
    cta: string;
    createLink: string;
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
    errorResend: string;
  };
  methods: {
    label: string;
    otp: string;
    password: string;
  };
  password: {
    heading: string;
    label: string;
    placeholder: string;
    errorRequired: string;
    errorGeneric: string;
    submit: string;
    submitting: string;
    useOtp: string;
  };
}

export default function LoginFlow() {
  const { user, login } = useAuth();
  const router = useRouter();
  const { getCopy } = useLanguage();
  const loginCopy = getCopy<LoginCopy>("login");
  const [step, setStep] = useState<"phone" | "otp">("phone");
  const [phone, setPhone] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [normalizedPhone, setNormalizedPhone] = useState("");
  const [otpValues, setOtpValues] = useState(Array(OTP_LENGTH).fill(""));
  const [otpError, setOtpError] = useState("");
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(60);
  const [loginMethod, setLoginMethod] = useState<"otp" | "password">("otp");
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
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
    const countdown = setInterval(
      () => setTimer((value) => Math.max(0, value - 1)),
      1000
    );
    return () => clearInterval(countdown);
  }, [step, timer]);

  const switchToOtp = () => {
    setLoginMethod("otp");
    setStep("phone");
    setPhoneError("");
    setOtpValues(Array(OTP_LENGTH).fill(""));
    setOtpError("");
    setTimer(60);
    setLoading(false);
    setPassword("");
    setPasswordError("");
    setPasswordLoading(false);
    setShowPassword(false);
  };

  const switchToPassword = () => {
    setLoginMethod("password");
    setStep("phone");
    setPhoneError("");
    setOtpValues(Array(OTP_LENGTH).fill(""));
    setOtpError("");
    setTimer(60);
    setNormalizedPhone("");
    setLoading(false);
    setPassword("");
    setPasswordError("");
    setPasswordLoading(false);
    setShowPassword(false);
  };

  const handleSendOtp = () => {
    const normalized = normalizeBangladeshPhone(phone.trim());
    if (!normalized) {
      setPhoneError(loginCopy.phone.errorInvalid);
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
      setOtpError(loginCopy.otp.errorCode);
      return;
    }
    if (!normalizedPhone) {
      setOtpError(loginCopy.otp.errorResend);
      return;
    }
    setLoading(true);
    setTimeout(() => {
      void login({ phone: normalizedPhone, method: "otp" }).then(() => {
        router.replace("/account");
      });
    }, 900);
  };

  const handlePasswordLogin = () => {
    const normalized = normalizeBangladeshPhone(phone.trim());
    if (!normalized) {
      setPhoneError(loginCopy.phone.errorInvalid);
      return;
    }
    if (!password) {
      setPasswordError(loginCopy.password.errorRequired);
      return;
    }
    setPhoneError("");
    setPasswordError("");
    setPasswordLoading(true);
    setTimeout(async () => {
      const result = await login({ phone: normalized, method: "password", password });
      setPasswordLoading(false);
      if (!result.success) {
        setPasswordError(result.message ?? loginCopy.password.errorGeneric);
        return;
      }
      router.replace("/account");
    }, 700);
  };

  const resendInfoParts = loginCopy.otp.resendInfo.split("{{seconds}}");

  return (
    <section className="relative mx-auto max-w-4xl overflow-hidden rounded-4xl border border-slate-100 bg-white shadow-soft">
      <div className="grid gap-0 lg:grid-cols-[1.2fr_1fr]">
        <div className="p-8 sm:p-12">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            {loginCopy.badge}
          </div>
          <h1 className="mt-4 text-3xl font-bold text-slate-900 sm:text-4xl">
            {loginCopy.heading}
          </h1>
          <p className="mt-2 text-sm text-slate-600 sm:text-base">
            {loginCopy.intro}
          </p>
          <div className="mt-6">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
              {loginCopy.methods.label}
            </p>
            <div className="mt-2 inline-flex rounded-full border border-slate-200 bg-slate-50/70 p-1">
              <button
                type="button"
                onClick={switchToOtp}
                className={`cursor-pointer rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-wide transition ${
                  loginMethod === "otp"
                    ? "bg-white text-slate-900 shadow-sm"
                    : "text-slate-500 hover:text-slate-700"
                }`}
              >
                {loginCopy.methods.otp}
              </button>
              <button
                type="button"
                onClick={switchToPassword}
                className={`cursor-pointer rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-wide transition ${
                  loginMethod === "password"
                    ? "bg-white text-slate-900 shadow-sm"
                    : "text-slate-500 hover:text-slate-700"
                }`}
              >
                {loginCopy.methods.password}
              </button>
            </div>
          </div>

          {loginMethod === "otp" && step === "phone" && (
            <form
              className="mt-10 space-y-5"
              onSubmit={(event) => {
                event.preventDefault();
                handleSendOtp();
              }}
            >
              <div>
                <label className="text-sm font-semibold text-slate-700">
                  {loginCopy.phone.label}
                </label>
                <div className="mt-2 flex items-center rounded-2xl border border-slate-200 bg-slate-50/80 px-4 py-3 focus-within:border-slate-300 focus-within:bg-white focus-within:ring-2 focus-within:ring-slate-200">
                  <span className="mr-2 text-sm font-semibold text-slate-500">
                    +880
                  </span>
                  <input
                    type="tel"
                    inputMode="tel"
                    className="w-full border-0 bg-transparent text-base font-medium text-slate-800 outline-none"
                    placeholder={loginCopy.phone.placeholder}
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
                className="cursor-pointer w-full rounded-full bg-brand-gradient px-6 py-3 text-sm font-semibold text-white shadow-soft transition hover:-translate-y-0.5 hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-70"
              >
                {loading ? loginCopy.phone.sending : loginCopy.phone.send}
              </button>
              <p className="cursor-pointer text-center text-xs text-slate-500">
                {loginCopy.phone.cta}{" "}
                <Link
                  href="/signup"
                  className="font-semibold text-slate-900 hover:underline"
                >
                  {loginCopy.phone.createLink}
                </Link>
              </p>
            </form>
          )}

          {loginMethod === "otp" && step === "otp" && (
            <form
              className="mt-10 space-y-6"
              onSubmit={(event) => {
                event.preventDefault();
                handleVerifyOtp();
              }}
            >
              <div className="rounded-3xl border border-slate-100 bg-slate-50/70 p-4">
                <p className="text-sm font-semibold text-slate-700">
                  {loginCopy.otp.heading}
                </p>
                <p className="mt-1 text-lg font-semibold text-slate-900">
                  {normalizedPhone}
                </p>
                <p className="mt-2 text-xs text-slate-500">
                  {resendInfoParts[0]}
                  <span className="font-semibold text-slate-700">{timer}</span>
                  {resendInfoParts[1] ?? ""}
                </p>
              </div>
              <div>
                <label className="text-sm font-semibold text-slate-700">
                  {loginCopy.otp.label}
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
                  className="cursor-pointer w-full rounded-full border border-slate-200 px-6 py-3 text-sm font-semibold text-slate-600 transition hover:border-slate-300 hover:text-slate-900 sm:w-auto"
                  onClick={() => {
                    setStep("phone");
                    setOtpValues(Array(OTP_LENGTH).fill(""));
                    setNormalizedPhone("");
                    setTimer(60);
                  }}
                >
                  {loginCopy.otp.edit}
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="cursor-pointer w-full rounded-full bg-brand-gradient px-6 py-3 text-sm font-semibold text-white shadow-soft transition hover:-translate-y-0.5 hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-70 sm:w-auto"
                >
                  {loading ? loginCopy.otp.verifying : loginCopy.otp.verify}
                </button>
              </div>
              <div className="text-center text-xs text-slate-500">
                {loginCopy.otp.resendCta}{" "}
                <button
                  type="button"
                  disabled={timer > 0}
                  onClick={handleSendOtp}
                  className="cursor-pointer font-semibold text-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {loginCopy.otp.resend}
                </button>
              </div>
            </form>
          )}

          {loginMethod === "password" && (
            <form
              className="mt-10 space-y-5"
              onSubmit={(event) => {
                event.preventDefault();
                handlePasswordLogin();
              }}
            >
              <div>
                <label className="text-sm font-semibold text-slate-700">
                  {loginCopy.phone.label}
                </label>
                <div className="mt-2 flex items-center rounded-2xl border border-slate-200 bg-slate-50/80 px-4 py-3 focus-within:border-slate-300 focus-within:bg-white focus-within:ring-2 focus-within:ring-slate-200">
                  <span className="mr-2 text-sm font-semibold text-slate-500">
                    +880
                  </span>
                  <input
                    type="tel"
                    inputMode="tel"
                    className="w-full border-0 bg-transparent text-base font-medium text-slate-800 outline-none"
                    placeholder={loginCopy.phone.placeholder}
                    value={phone}
                    onChange={(event) => setPhone(event.target.value)}
                  />
                </div>
                {phoneError && (
                  <p className="mt-2 text-sm text-rose-500">{phoneError}</p>
                )}
              </div>
              <div>
                <label className="text-sm font-semibold text-slate-700">
                  {loginCopy.password.label}
                </label>
                <div className="mt-2 flex items-center rounded-2xl border border-slate-200 bg-white px-4 py-3 focus-within:border-slate-300 focus-within:ring-2 focus-within:ring-slate-200">
                  <input
                    type={showPassword ? "text" : "password"}
                    className="w-full border-0 bg-transparent text-base font-medium text-slate-800 outline-none"
                    placeholder={loginCopy.password.placeholder}
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                  />
                  <button
                    type="button"
                    className="cursor-pointer ml-3 text-xs font-semibold uppercase tracking-wide text-slate-500 transition hover:text-slate-700"
                    onClick={() => setShowPassword((value) => !value)}
                  >
                    {showPassword ? "Hide" : "Show"}
                  </button>
                </div>
                {passwordError && (
                  <p className="mt-2 text-sm text-rose-500">{passwordError}</p>
                )}
              </div>
              <button
                type="submit"
                disabled={passwordLoading}
                className="cursor-pointer w-full rounded-full bg-brand-gradient px-6 py-3 text-sm font-semibold text-white shadow-soft transition hover:-translate-y-0.5 hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-70"
              >
                {passwordLoading ? loginCopy.password.submitting : loginCopy.password.submit}
              </button>
              <div className="text-center text-xs text-slate-500">
                {loginCopy.password.useOtp}
                {" "}
                <button
                  type="button"
                  onClick={switchToOtp}
                  className="cursor-pointer font-semibold text-slate-900 hover:underline"
                >
                  {loginCopy.methods.otp}
                </button>
              </div>
            </form>
          )}
        </div>
        <div className="relative hidden min-h-full flex-col justify-between bg-brand-gradient p-10 text-white lg:flex">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-white/80">
              {loginCopy.sidebar.title}
            </p>
            <h2 className="mt-4 text-3xl font-bold leading-tight">
              {loginCopy.sidebar.headline}
            </h2>
            <p className="mt-3 text-sm text-white/70">
              {loginCopy.sidebar.paragraph}
            </p>
          </div>
          <div className="rounded-3xl bg-white/15 p-4 backdrop-blur">
            <p className="text-xs uppercase tracking-wide text-white/70">
              {loginCopy.sidebar.otp}
            </p>
            <p className="mt-2 text-sm text-white">
              {loginCopy.sidebar.otpText}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
