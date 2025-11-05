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
}

interface AuthContextValue {
  user: CarelyticUser | null;
  login: (payload: { phone: string }) => void;
  completeSignup: (profile: Omit<CarelyticUser, "history">) => void;
  logout: () => void;
  addHistory: (entry: HistoryEntry) => void;
  consumeCredits: (amount: number) => boolean;
  addCredits: (amount: number) => void;
  purchaseSubscription: (plan: SubscriptionPlan) => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const STORAGE_KEY = "carelytic-user";

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
    if (user) {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    } else {
      window.localStorage.removeItem(STORAGE_KEY);
    }
  }, [user]);

  const login = useCallback(({ phone }: { phone: string }) => {
    setUser((prev) => {
      if (prev && prev.phone === phone) {
        return {
          ...prev,
          subscriptionPlan: prev.subscriptionPlan ?? "payg",
          credits: prev.credits ?? 0,
        };
      }
      return {
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
    });
  }, []);

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
    }: Omit<CarelyticUser, "history">) => {
      setUser({
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
      return {
        ...prev,
        history: [entry, ...prev.history].slice(0, 12),
      };
    });
  }, []);

  const consumeCredits = useCallback((amount: number) => {
    let success = false;
    setUser((prev) => {
      if (!prev) return prev;
      if (prev.credits >= amount) {
        success = true;
        return { ...prev, credits: prev.credits - amount };
      }
      return prev;
    });
    return success;
  }, []);

  const addCredits = useCallback((amount: number) => {
    setUser((prev) => {
      if (!prev) return prev;
      return { ...prev, credits: prev.credits + amount };
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
      return {
        ...prev,
        subscriptionPlan: plan,
        subscriptionRenewal: plan === "payg" ? undefined : renewalDate.toISOString(),
        credits: plan === "payg" ? prev.credits : prev.credits + creditsToAdd,
      };
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
