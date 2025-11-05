import type { SubscriptionPlan } from "./AuthProvider";

export interface SubscriptionPlanInfo {
  id: SubscriptionPlan;
  title: string;
  price: string;
  description: string;
  credits: number;
  highlight: string;
}

export const subscriptionPlans: SubscriptionPlanInfo[] = [
  {
    id: "payg",
    title: "Pay as you go",
    price: "BDT 10 / report",
    description: "Perfect for occasional uploads. Pay BDT 10 each time you unlock a report.",
    credits: 0,
    highlight: "Standard pricing, no commitment.",
  },
  {
    id: "monthly",
    title: "Monthly subscription",
    price: "BDT 100 / month",
    description: "Includes 120 credits every month (covers 12 reports). Save about 20% overall.",
    credits: 120,
    highlight: "Auto-renews monthly. Unused credits roll forward for 90 days.",
  },
  {
    id: "yearly",
    title: "Yearly subscription",
    price: "BDT 1,000 / year",
    description: "Receive 1,500 credits upfront (~150 reports). The best value for regular users.",
    credits: 1500,
    highlight: "Single annual payment with the biggest credit bonus.",
  },
];
