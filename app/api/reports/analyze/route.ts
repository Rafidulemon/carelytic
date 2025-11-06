import { NextResponse } from "next/server";
import { GetObjectCommand } from "@aws-sdk/client-s3";
import { File } from "node:buffer";
import prisma from "@/lib/prisma";
import { getR2Client } from "@/lib/r2";
import { getOpenAIClient } from "@/lib/openai";
import { ReportStatus } from "@prisma/client";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

interface AnalyzePayload {
  userId?: string;
  bucket?: string;
  key?: string;
  originalName?: string;
  contentType?: string;
  size?: number;
  language?: "en" | "bn";
}

interface StructuredAnalysis {
  summary: string;
  detailed_analysis: string[] | string;
  next_steps: string[] | string;
}

async function streamToBuffer(stream: unknown) {
  if (!stream) {
    return Buffer.from([]);
  }
  const chunks: Buffer[] = [];
  for await (const chunk of stream as AsyncIterable<Buffer>) {
    chunks.push(Buffer.from(chunk));
  }
  return Buffer.concat(chunks);
}

function normalizeLanguage(value: unknown): "en" | "bn" {
  if (value === "bn") {
    return "bn";
  }
  return "en";
}

function buildSystemPrompt(language: "en" | "bn") {
  if (language === "bn") {
    return [
      "আপনি একজন মেডিকেল এআই সহকারী, বাংলাভাষী রোগীদের জন্য পরীক্ষার রিপোর্ট বিশ্লেষণ করেন।",
      "রোগীর গোপনীয়তা রক্ষা করুন, অবস্থা পরিষ্কারভাবে ব্যাখ্যা করুন, এবং ক্লিনিক্যালি দরকারি পরামর্শ দিন।",
      "সকল প্রতিক্রিয়া বাংলা ভাষায় দিন এবং চিকিৎসকের সাথে পরামর্শ করার গুরুত্ব উল্লেখ করুন।",
    ].join(" ");
  }
  return [
    "You are a medical AI assistant that interprets laboratory and diagnostic reports for patients.",
    "Keep explanations clear, empathetic, and clinically grounded with supportive recommendations.",
    "Always remind the patient to consult their licensed healthcare professional before acting.",
  ].join(" ");
}

function buildUserPrompt(language: "en" | "bn") {
  if (language === "bn") {
    return [
      "সংযুক্ত মেডিকেল রিপোর্টটি বিশ্লেষণ করুন এবং বৈধ JSON প্রত্যুত্তর দিন।",
      "JSON অবজেক্টে তিনটি ফিল্ড থাকবে:",
      '1. "summary": ৩-৪ বাক্যে মূল সারসংক্ষেপ।',
      '2. "detailed_analysis": প্রতিটি গুরুত্বপূর্ণ মেট্রিক বা পর্যবেক্ষণের ব্যাখ্যা সহ স্ট্রিং অ্যারে।',
      '3. "next_steps": রোগীর জন্য ক্লিনিক্যালি উপকারী করণীয় বা ফলো-আপ পরামর্শের অ্যারে।',
      "কোনো অতিরিক্ত টেক্সট, ব্যাখ্যা বা কোডব্লক যুক্ত করবেন না। শুধুমাত্র JSON দিন।",
    ].join(" ");
  }
  return [
    "Analyze the attached medical report and reply with a VALID JSON object only.",
    'Fields required: "summary" (3-4 sentence overview),',
    '"detailed_analysis" (array of strings explaining notable metrics, trends, or flags),',
    '"next_steps" (array of actionable follow-ups or precautions for the patient).',
    "No extra commentary or markdown—return raw JSON that can be parsed directly.",
  ].join(" ");
}

function formatText(value: string[] | string) {
  if (Array.isArray(value)) {
    return value.join("\n");
  }
  return value;
}

export async function POST(request: Request) {
  let reportId: string | null = null;
  try {
    const payload = (await request.json()) as AnalyzePayload;
    const {
      userId,
      bucket,
      key,
      originalName,
      contentType,
      size,
      language: rawLanguage,
    } = payload;

    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required." },
        { status: 400 }
      );
    }

    if (!bucket || !key || !originalName || !contentType || !size) {
      return NextResponse.json(
        { error: "File metadata is incomplete." },
        { status: 400 }
      );
    }

    if (size <= 0) {
      return NextResponse.json(
        { error: "Uploaded file size must be greater than zero." },
        { status: 400 }
      );
    }

    const language = normalizeLanguage(rawLanguage);

    const { client, config } = getR2Client();

    if (bucket !== config.bucket) {
      return NextResponse.json(
        { error: "Bucket does not match configured storage." },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true },
    });

    if (!user) {
      return NextResponse.json(
        {
          error:
            "We couldn't find your account. Please sign out and sign back in before uploading again.",
        },
        { status: 404 }
      );
    }

    const report = await prisma.report.create({
      data: {
        userId,
        originalName,
        storageKey: key,
        storageBucket: bucket,
        contentType,
        fileSizeBytes: size,
        status: ReportStatus.PROCESSING,
      },
    });
    reportId = report.id;

    const object = await client.send(
      new GetObjectCommand({
        Bucket: bucket,
        Key: key,
      })
    );

    const buffer = await streamToBuffer(object.Body);
    if (!buffer.length) {
      throw new Error("Retrieved file is empty.");
    }

    const openai = getOpenAIClient();
    const file = await openai.files.create({
      file: new File([buffer], originalName, {
        type: contentType ?? "application/octet-stream",
      }),
      purpose: "assistants",
    });

    const systemPrompt = buildSystemPrompt(language);
    const userPrompt = buildUserPrompt(language);

    const response = await openai.responses.create({
      model: "gpt-4.1-mini",
      input: [
        {
          role: "system",
          content: [{ type: "input_text", text: systemPrompt }],
        },
        {
          role: "user",
          content: [
            { type: "input_text", text: userPrompt },
            { type: "input_file", file_id: file.id },
          ],
        },
      ],
      max_output_tokens: 1200,
    });

    void openai.files.del(file.id).catch((error) => {
      console.warn("Failed to delete OpenAI file", error);
    });

    const outputText = response.output_text;
    if (!outputText) {
      throw new Error("OpenAI did not return textual output.");
    }

    let parsed: StructuredAnalysis | null = null;
    try {
      parsed = JSON.parse(outputText) as StructuredAnalysis;
    } catch (error) {
      console.error("Failed to parse analysis", error);
      throw new Error("Analysis response could not be parsed.");
    }

    if (
      !parsed ||
      typeof parsed.summary !== "string" ||
      (!Array.isArray(parsed.detailed_analysis) &&
        typeof parsed.detailed_analysis !== "string") ||
      (!Array.isArray(parsed.next_steps) && typeof parsed.next_steps !== "string")
    ) {
      throw new Error("Analysis response did not match expected structure.");
    }

    const details = formatText(parsed.detailed_analysis);
    const actions = formatText(parsed.next_steps);

    const analysis = await prisma.reportAnalysis.create({
      data: {
        reportId: report.id,
        language,
        summary: parsed.summary,
        details,
        actions,
      },
    });

    await prisma.report.update({
      where: { id: report.id },
      data: {
        status: ReportStatus.COMPLETE,
        summary: parsed.summary,
        attentionCount: Array.isArray(parsed.next_steps)
          ? parsed.next_steps.length
          : parsed.next_steps
              .split("\n")
              .filter((line) => line.trim().length > 0).length,
        completedAt: new Date(),
      },
    });

    return NextResponse.json({
      reportId: report.id,
      analysis: {
        summary: parsed.summary,
        details,
        actions,
        language,
        createdAt: analysis.createdAt,
      },
    });
  } catch (error) {
    console.error("Report analysis failed", error);
    if (reportId) {
      await prisma.report.update({
        where: { id: reportId },
        data: {
          status: ReportStatus.FAILED,
        },
      });
    }
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to analyze report." },
      { status: 500 }
    );
  }
}
