import { NextResponse } from "next/server";
import { hash } from "bcryptjs";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const SALT_ROUNDS = 12;

export async function POST(request: Request) {
  try {
    const { password } = (await request.json()) as { password?: string };

    if (typeof password !== "string" || password.trim().length === 0) {
      return NextResponse.json(
        { error: "Password is required." },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: "Password must be at least 6 characters long." },
        { status: 400 }
      );
    }

    const hashedPassword = await hash(password, SALT_ROUNDS);
    return NextResponse.json({ hashedPassword });
  } catch (error) {
    console.error("Failed to hash password", error);
    return NextResponse.json(
      { error: "Unable to hash password at this time." },
      { status: 500 }
    );
  }
}
