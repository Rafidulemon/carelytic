import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import prisma from "@/lib/prisma";

type ReportWithAnalysis = Prisma.ReportGetPayload<{ include: { analysis: true } }>;

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required." },
        { status: 400 }
      );
    }

    const reports: ReportWithAnalysis[] = await prisma.report.findMany({
      where: { userId },
      include: {
        analysis: true,
      },
      orderBy: { uploadedAt: "desc" },
      take: 25,
    });

    const entries = reports
      .filter((report) => report.analysis)
      .map((report) => {
        const analysis = report.analysis!;
        const highlights = analysis.actions
          .split("\n")
          .map((line) => line.trim())
          .filter((line) => line.length > 0)
          .slice(0, 3);

        return {
          id: report.id,
          title: report.originalName,
          summary: analysis.summary ?? report.summary,
          date: (report.completedAt ?? report.uploadedAt).toISOString(),
          highlights,
          attentionCount: report.attentionCount,
        };
      });

    return NextResponse.json({
      reports: entries,
    });
  } catch (error) {
    console.error("Failed to load history", error);
    return NextResponse.json(
      { error: "Failed to load history." },
      { status: 500 }
    );
  }
}
