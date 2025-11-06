"use client";

import { useMemo } from "react";
import type { SubscriptionPlan } from "./AuthProvider";
import { useLanguage } from "./LanguageProvider";

const PLAN_BASE = [
  { id: "payg", credits: 0 },
  { id: "monthly", credits: 120 },
  { id: "yearly", credits: 1500 },
] as const satisfies ReadonlyArray<{ id: SubscriptionPlan; credits: number }>;

type PlanCopy = {
  title: string;
  price: string;
  description: string;
  highlight: string;
};

export type SubscriptionPlanInfo = {
  id: SubscriptionPlan;
  credits: number;
} & PlanCopy;

export function useSubscriptionPlans(): SubscriptionPlanInfo[] {
  const { getCopy } = useLanguage();
  const planCopy = getCopy<Record<SubscriptionPlan, PlanCopy>>("plans");

  return useMemo(
    () => PLAN_BASE.map((plan) => ({ ...plan, ...planCopy[plan.id] })),
    [planCopy]
  );
}

export function useSubscriptionPlan(planId: SubscriptionPlan) {
  const plans = useSubscriptionPlans();
  return useMemo(() => plans.find((plan) => plan.id === planId), [plans, planId]);
}
