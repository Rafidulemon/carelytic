import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const userId = request.nextUrl.searchParams.get("userId");

    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required." },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { credits: true, updatedAt: true },
    });

    if (!user) {
      return NextResponse.json(
        { error: "User not found." },
        { status: 404 }
      );
    }

    return NextResponse.json({
      userId,
      credits: user.credits,
      updatedAt: user.updatedAt.toISOString(),
    });
  } catch (error) {
    console.error("Failed to load user credits", error);
    return NextResponse.json(
      { error: "Unable to load credits right now." },
      { status: 500 }
    );
  }
}
