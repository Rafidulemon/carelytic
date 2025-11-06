"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export interface HistoryEntry {
  id: string;
  title: string;
  date: string;
  summary: string;
  highlights: string[];
}

export type BloodGroup = "A+" | "A-" | "B+" | "B-" | "AB+" | "AB-" | "O+" | "O-";
export type SubscriptionPlan = "payg" | "monthly" | "yearly";

export interface CarelyticUser {
  id?: string;
  phone: string;
  name?: string;
  email?: string;
  bloodGroup?: BloodGroup;
  isDiabetic?: boolean;
  hasHypertension?: boolean;
  subscriptionPlan: SubscriptionPlan;
  subscriptionRenewal?: string;
  credits: number;
  history: HistoryEntry[];
  passwordHash?: string;
}

interface AuthContextValue {
  user: CarelyticUser | null;
  login: (payload: { phone: string; method: "otp" | "password"; password?: string }) => Promise<{ success: boolean; message?: string }>;
  completeSignup: (profile: Omit<CarelyticUser, "history" | "passwordHash"> & { password: string }) => void;
  logout: () => void;
  addHistory: (entry: HistoryEntry) => void;
  consumeCredits: (amount: number) => boolean;
  addCredits: (amount: number) => void;
  purchaseSubscription: (plan: SubscriptionPlan) => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const STORAGE_KEY = "carelytic-user";
const USERS_KEY = "carelytic-users";

function hashPassword(password: string) {
  let hash = 0;
  for (let index = 0; index < password.length; index += 1) {
    hash = (hash << 5) - hash + password.charCodeAt(index);
    hash |= 0;
  }
  return hash.toString(16);
}

const demoHistory: HistoryEntry[] = [
  {
    id: "cbc-87234",
    title: "Complete Blood Count",
    date: "2024-06-12",
    summary: "Normal range with mild WBC elevation flagged for review.",
    highlights: ["WBC: 11.2 k/µL (Attention)", "Hemoglobin: 13.5 g/dL (Normal)"],
  },
  {
    id: "metabolic-48391",
    title: "Comprehensive Metabolic Panel",
    date: "2024-05-27",
    summary: "Glucose trending up; hydration and lifestyle adjustments suggested.",
    highlights: ["Glucose: 104 mg/dL (Attention)", "Creatinine: 0.92 mg/dL (Normal)"],
  },
  {
    id: "lipid-21873",
    title: "Lipid Profile",
    date: "2024-04-18",
    summary: "LDL within target; HDL slightly below optimal range.",
    highlights: ["LDL: 95 mg/dL (Normal)", "HDL: 38 mg/dL (Attention)"],
  },
];

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<CarelyticUser | null>(null);
  const [savedUsers, setSavedUsers] = useState<CarelyticUser[]>([]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (!stored) return;
    try {
      const parsed = JSON.parse(stored) as CarelyticUser;
      const normalized: CarelyticUser = {
        ...parsed,
        subscriptionPlan: parsed.subscriptionPlan ?? "payg",
        credits: parsed.credits ?? 0,
        history: parsed.history ?? demoHistory,
      };
      const frame = window.requestAnimationFrame(() => setUser(normalized));
      return () => window.cancelAnimationFrame(frame);
    } catch {
      window.localStorage.removeItem(STORAGE_KEY);
    }
    return undefined;
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const stored = window.localStorage.getItem(USERS_KEY);
    if (!stored) return;
    try {
      const parsed = JSON.parse(stored) as CarelyticUser[];
      const frame = window.requestAnimationFrame(() => setSavedUsers(parsed));
      return () => window.cancelAnimationFrame(frame);
    } catch {
      window.localStorage.removeItem(USERS_KEY);
    }
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (user) {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    } else {
      window.localStorage.removeItem(STORAGE_KEY);
    }
  }, [user]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    window.localStorage.setItem(USERS_KEY, JSON.stringify(savedUsers));
  }, [savedUsers]);

  const login = useCallback(
    async ({
      phone,
      method,
      password,
    }: {
      phone: string;
      method: "otp" | "password";
      password?: string;
    }) => {
      const existing = savedUsers.find((entry) => entry.phone === phone);

      if (method === "password") {
        if (!password) {
          return { success: false, message: "Enter your password to continue." };
        }

        if (existing?.passwordHash) {
          const hashed = hashPassword(password);
          if (existing.passwordHash !== hashed) {
            return { success: false, message: "Incorrect password. Try again or switch to OTP." };
          }
          const nextUser: CarelyticUser = {
            ...existing,
            history: existing.history?.length ? existing.history : demoHistory,
            subscriptionPlan: existing.subscriptionPlan ?? "payg",
            credits: existing.credits ?? 0,
          };
          setUser(nextUser);
          return { success: true };
        }

        try {
          const response = await fetch("/api/auth/password-login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ phone, password }),
          });
          const payload = (await response.json()) as {
            success: boolean;
            message?: string;
            user?: {
              id?: string;
              phone: string;
              name?: string;
              email?: string;
              bloodGroup?: BloodGroup;
              isDiabetic?: boolean;
              hasHypertension?: boolean;
              subscriptionPlan?: SubscriptionPlan;
              subscriptionRenewal?: string;
              credits?: number;
            };
          };

          if (!payload.success || !payload.user) {
            return {
              success: false,
              message: payload.message ?? "We couldn't log you in. Please try again.",
            };
          }

          const nextUser: CarelyticUser = {
            ...existing,
            id: payload.user.id,
            phone: payload.user.phone,
            name: payload.user.name ?? existing?.name,
            email: payload.user.email ?? existing?.email,
            bloodGroup: payload.user.bloodGroup ?? existing?.bloodGroup,
            isDiabetic: payload.user.isDiabetic ?? existing?.isDiabetic,
            hasHypertension: payload.user.hasHypertension ?? existing?.hasHypertension,
            subscriptionPlan:
              payload.user.subscriptionPlan ?? existing?.subscriptionPlan ?? "payg",
            subscriptionRenewal: payload.user.subscriptionRenewal ?? existing?.subscriptionRenewal,
            credits: payload.user.credits ?? existing?.credits ?? 0,
            history: existing?.history?.length ? existing.history : demoHistory,
            passwordHash: existing?.passwordHash,
          };

          setUser(nextUser);
          setSavedUsers((prev) => {
            const others = prev.filter((entry) => entry.phone !== nextUser.phone);
            return [...others, nextUser];
          });
          return { success: true };
        } catch (error) {
          console.error("Password login failed", error);
          return {
            success: false,
            message: "We could not reach the server. Please try again.",
          };
        }
      }

      const nextUser: CarelyticUser =
        existing ?? {
          phone,
          name: undefined,
          email: undefined,
          bloodGroup: undefined,
          isDiabetic: undefined,
          hasHypertension: undefined,
          subscriptionPlan: "payg",
          subscriptionRenewal: undefined,
          credits: 0,
          history: demoHistory,
        };

      setUser(nextUser);
      if (!existing) {
        setSavedUsers((prev) => [...prev, nextUser]);
      } else {
        setSavedUsers((prev) =>
          prev.map((entry) => (entry.phone === nextUser.phone ? { ...nextUser } : entry))
        );
      }
      return { success: true };
    },
    [savedUsers]
  );

  const completeSignup = useCallback(
    ({
      phone,
      name,
      email,
      bloodGroup,
      isDiabetic,
      hasHypertension,
      subscriptionPlan,
      subscriptionRenewal,
      credits,
      password,
    }: Omit<CarelyticUser, "history" | "passwordHash"> & { password: string }) => {
      const passwordHash = hashPassword(password);
      const nextUser: CarelyticUser = {
        phone,
        name,
        email,
        bloodGroup,
        isDiabetic,
        hasHypertension,
        subscriptionPlan: subscriptionPlan ?? "payg",
        subscriptionRenewal,
        credits: credits ?? 0,
        history: demoHistory,
        passwordHash,
      };
      setUser(nextUser);
      setSavedUsers((prev) => {
        const others = prev.filter((entry) => entry.phone !== phone);
        return [...others, nextUser];
      });
    },
    []
  );

  const logout = useCallback(() => {
    setUser(null);
  }, []);

  const addHistory = useCallback((entry: HistoryEntry) => {
    setUser((prev) => {
      if (!prev) return prev;
      const updated: CarelyticUser = {
        ...prev,
        history: [entry, ...prev.history].slice(0, 12),
      };
      setSavedUsers((list) => {
        const others = list.filter((item) => item.phone !== updated.phone);
        return [...others, updated];
      });
      return updated;
    });
  }, []);

  const consumeCredits = useCallback((amount: number) => {
    let success = false;
    setUser((prev) => {
      if (!prev) return prev;
      if (prev.credits >= amount) {
        success = true;
        const updated: CarelyticUser = { ...prev, credits: prev.credits - amount };
        setSavedUsers((list) => {
          const others = list.filter((item) => item.phone !== updated.phone);
          return [...others, updated];
        });
        return updated;
      }
      return prev;
    });
    return success;
  }, []);

  const addCredits = useCallback((amount: number) => {
    setUser((prev) => {
      if (!prev) return prev;
      const updated: CarelyticUser = { ...prev, credits: prev.credits + amount };
      setSavedUsers((list) => {
        const others = list.filter((item) => item.phone !== updated.phone);
        return [...others, updated];
      });
      return updated;
    });
  }, []);

  const purchaseSubscription = useCallback((plan: SubscriptionPlan) => {
    const now = new Date();
    const renewalDate = new Date(now);
    let creditsToAdd = 0;
    if (plan === "monthly") {
      renewalDate.setMonth(now.getMonth() + 1);
      creditsToAdd = 120;
    } else if (plan === "yearly") {
      renewalDate.setFullYear(now.getFullYear() + 1);
      creditsToAdd = 1500;
    }
    setUser((prev) => {
      if (!prev) return prev;
      const updated: CarelyticUser = {
        ...prev,
        subscriptionPlan: plan,
        subscriptionRenewal: plan === "payg" ? undefined : renewalDate.toISOString(),
        credits: plan === "payg" ? prev.credits : prev.credits + creditsToAdd,
      };
      setSavedUsers((list) => {
        const others = list.filter((item) => item.phone !== updated.phone);
        return [...others, updated];
      });
      return updated;
    });
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      login,
      completeSignup,
      logout,
      addHistory,
      consumeCredits,
      addCredits,
      purchaseSubscription,
    }),
    [user, login, completeSignup, logout, addHistory, consumeCredits, addCredits, purchaseSubscription]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
