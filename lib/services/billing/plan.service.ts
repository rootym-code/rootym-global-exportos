/**
 * Author: Prem Singh
 * Purpose: Resolves and maintains the single ROOTYM SaaS product's trial, monthly, and annual billing plans.
 */

import prisma from "@/lib/prisma";

import {
  BillingInterval,
  PlanType,
} from "@/lib/generated/prisma";

export const ROOTYM_PLAN_CODES = {
  TRIAL: "TRIAL_30_DAYS",
  MONTHLY: "ROOTYM_MONTHLY",
  ANNUAL: "ROOTYM_ANNUAL",
} as const;

export const ROOTYM_PRICING = {
  MONTHLY: {
    amount: 15999,
    currency: "INR",
    billingInterval:
      BillingInterval.MONTHLY,
  },
  ANNUAL: {
    amount: 189999,
    currency: "INR",
    billingInterval:
      BillingInterval.ANNUAL,
  },
} as const;

const TRIAL_DAYS = 30;

export async function ensureRootymTrialPlan() {
  return prisma.plan.upsert({
    where: {
      code: ROOTYM_PLAN_CODES.TRIAL,
    },
    update: {
      name: "30-Day Free Trial",
      description:
        "Optional 30-day free trial for ROOTYM SaaS customers.",
      type: PlanType.TRIAL,
      amount: 0,
      currency: "INR",
      trialDays: TRIAL_DAYS,
      isActive: true,
    },
    create: {
      code: ROOTYM_PLAN_CODES.TRIAL,
      name: "30-Day Free Trial",
      description:
        "Optional 30-day free trial for ROOTYM SaaS customers.",
      type: PlanType.TRIAL,
      billingInterval:
        BillingInterval.MONTHLY,
      amount: 0,
      currency: "INR",
      trialDays: TRIAL_DAYS,
      isActive: true,
    },
  });
}

export async function ensureRootymPaidPlans() {
  const monthlyPlan =
    await prisma.plan.upsert({
      where: {
        code: ROOTYM_PLAN_CODES.MONTHLY,
      },
      update: {
        name: "ROOTYM SaaS Monthly",
        description:
          "ROOTYM SaaS monthly subscription.",
        type: PlanType.PAID,
        billingInterval:
          BillingInterval.MONTHLY,
        amount:
          ROOTYM_PRICING.MONTHLY.amount,
        currency:
          ROOTYM_PRICING.MONTHLY.currency,
        trialDays: 0,
        isActive: true,
      },
      create: {
        code: ROOTYM_PLAN_CODES.MONTHLY,
        name: "ROOTYM SaaS Monthly",
        description:
          "ROOTYM SaaS monthly subscription.",
        type: PlanType.PAID,
        billingInterval:
          BillingInterval.MONTHLY,
        amount:
          ROOTYM_PRICING.MONTHLY.amount,
        currency:
          ROOTYM_PRICING.MONTHLY.currency,
        trialDays: 0,
        isActive: true,
      },
    });

  const annualPlan =
    await prisma.plan.upsert({
      where: {
        code: ROOTYM_PLAN_CODES.ANNUAL,
      },
      update: {
        name: "ROOTYM SaaS Annual",
        description:
          "ROOTYM SaaS annual subscription.",
        type: PlanType.PAID,
        billingInterval:
          BillingInterval.ANNUAL,
        amount:
          ROOTYM_PRICING.ANNUAL.amount,
        currency:
          ROOTYM_PRICING.ANNUAL.currency,
        trialDays: 0,
        isActive: true,
      },
      create: {
        code: ROOTYM_PLAN_CODES.ANNUAL,
        name: "ROOTYM SaaS Annual",
        description:
          "ROOTYM SaaS annual subscription.",
        type: PlanType.PAID,
        billingInterval:
          BillingInterval.ANNUAL,
        amount:
          ROOTYM_PRICING.ANNUAL.amount,
        currency:
          ROOTYM_PRICING.ANNUAL.currency,
        trialDays: 0,
        isActive: true,
      },
    });

  return {
    monthlyPlan,
    annualPlan,
  };
}

export async function getRootymPaidPlan(
  billingInterval: BillingInterval
) {
  const plan =
    await prisma.plan.findFirst({
      where: {
        type: PlanType.PAID,
        billingInterval,
        isActive: true,
      },
      orderBy: {
        createdAt: "asc",
      },
    });

  if (!plan) {
    throw new Error(
      `ROOTYM ${billingInterval.toLowerCase()} billing plan is not configured.`
    );
  }

  if (!plan.amount || plan.amount <= 0) {
    throw new Error(
      `ROOTYM ${billingInterval.toLowerCase()} billing plan has an invalid price.`
    );
  }

  if (plan.currency !== "INR") {
    throw new Error(
      `ROOTYM ${billingInterval.toLowerCase()} billing plan must use INR.`
    );
  }

  return plan;
}

export async function getRootymPlanByCode(
  code: string
) {
  const plan =
    await prisma.plan.findUnique({
      where: {
        code,
      },
    });

  if (!plan) {
    throw new Error(
      `ROOTYM billing plan "${code}" was not found.`
    );
  }

  if (!plan.isActive) {
    throw new Error(
      `ROOTYM billing plan "${code}" is inactive.`
    );
  }

  return plan;
}