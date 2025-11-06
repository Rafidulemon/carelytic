import { NextResponse } from "next/server";
import { randomUUID } from "node:crypto";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getR2Client } from "@/lib/r2";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function isFile(value: unknown): value is File {
  return typeof value === "object" && value !== null && "arrayBuffer" in value && "name" in value;
}

const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024; // 5MB

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const maybeFile = formData.get("file");

    if (!isFile(maybeFile)) {
      return NextResponse.json({ error: "No file uploaded." }, { status: 400 });
    }

    const file = maybeFile;
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    if (buffer.byteLength === 0) {
      return NextResponse.json({ error: "Uploaded file is empty." }, { status: 400 });
    }

    if (buffer.byteLength > MAX_FILE_SIZE_BYTES) {
      return NextResponse.json(
        { error: "File is too large. Maximum size is 5 MB." },
        { status: 413 }
      );
    }

    const { client, config } = getR2Client();

    const originalName = file.name ?? "upload";
    const extension = originalName.includes(".") ? `.${originalName.split(".").pop()}` : "";
    const key = `${new Date().toISOString().slice(0, 10)}/${randomUUID()}${extension}`;

    await client.send(
      new PutObjectCommand({
        Bucket: config.bucket,
        Key: key,
        Body: buffer,
        ContentType: file.type || "application/octet-stream",
        Metadata: {
          originalName,
        },
      })
    );

    return NextResponse.json({
      bucket: config.bucket,
      key,
      size: buffer.byteLength,
      contentType: file.type || "application/octet-stream",
      originalName,
    });
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ error: "Unexpected error" }, { status: 500 });
  }
}
