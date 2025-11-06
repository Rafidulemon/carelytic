import { NextResponse } from 'next/server';
import { compare } from 'bcryptjs';
import { BloodGroup, SubscriptionPlan } from '@prisma/client';
import prisma from '@/lib/prisma';

function toClientBloodGroup(value: BloodGroup | null): string | undefined {
  if (!value) return undefined;
  const mapping: Record<BloodGroup, string> = {
    A_POS: 'A+',
    A_NEG: 'A-',
    B_POS: 'B+',
    B_NEG: 'B-',
    AB_POS: 'AB+',
    AB_NEG: 'AB-',
    O_POS: 'O+',
    O_NEG: 'O-',
  };
  return mapping[value];
}

function toClientPlan(value: SubscriptionPlan | null): 'payg' | 'monthly' | 'yearly' {
  if (!value) return 'payg';
  const mapping: Record<SubscriptionPlan, 'payg' | 'monthly' | 'yearly'> = {
    PAYG: 'payg',
    MONTHLY: 'monthly',
    YEARLY: 'yearly',
  };
  return mapping[value];
}

export async function POST(request: Request) {
  try {
    const { phone, password } = (await request.json()) as { phone?: string; password?: string };

    if (!phone || !password) {
      return NextResponse.json(
        { success: false, message: 'Phone number and password are required.' },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({ where: { phone } });

    if (!user || !user.hashedPassword) {
      return NextResponse.json({
        success: false,
        message: 'Password login is not set up for this number.',
      });
    }

    const isValid = await compare(password, user.hashedPassword);

    if (!isValid) {
      return NextResponse.json({
        success: false,
        message: 'Incorrect password. Try again or switch to OTP.',
      });
    }

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        phone: user.phone,
        name: user.name ?? undefined,
        email: user.email ?? undefined,
        bloodGroup: toClientBloodGroup(user.bloodGroup),
        isDiabetic: user.isDiabetic ?? undefined,
        hasHypertension: user.hasHypertension ?? undefined,
        subscriptionPlan: toClientPlan(user.subscriptionPlan),
        subscriptionRenewal: user.subscriptionRenewal?.toISOString(),
        credits: user.credits,
      },
    });
  } catch (error) {
    console.error('Password login failed', error);
    return NextResponse.json(
      {
        success: false,
        message: 'We could not log you in. Please try again in a moment.',
      },
      { status: 500 }
    );
  }
}
