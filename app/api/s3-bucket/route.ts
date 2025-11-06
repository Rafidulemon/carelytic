import { NextResponse } from "next/server";

export async function GET() {
  const bucket = process.env.S3_BUCKET ?? "";
  return NextResponse.json({
    configured: bucket.length > 0,
    bucket,
  });
}
