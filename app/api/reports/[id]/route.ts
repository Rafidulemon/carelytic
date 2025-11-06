import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(_request: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;
    const report = await prisma.report.findUnique({
      where: { id },
      include: {
        analysis: true,
      },
    });

    if (!report || !report.analysis) {
      return NextResponse.json({ error: "Report not found." }, { status: 404 });
    }

    return NextResponse.json({
      report: {
        id: report.id,
        originalName: report.originalName,
        status: report.status,
        summary: report.summary,
        attentionCount: report.attentionCount,
        uploadedAt: report.uploadedAt,
        completedAt: report.completedAt,
        analysis: {
          summary: report.analysis.summary,
          details: report.analysis.details,
          actions: report.analysis.actions,
          language: report.analysis.language,
          createdAt: report.analysis.createdAt,
        },
      },
    });
  } catch (error) {
    console.error("Failed to load report", error);
    return NextResponse.json(
      { error: "Failed to load report." },
      { status: 500 }
    );
  }
}
