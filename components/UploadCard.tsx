"use client";

import type { ChangeEvent, DragEvent } from "react";
import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "./AuthProvider";
import { useLanguage } from "./LanguageProvider";

type AnalysisStage = "idle" | "processing" | "complete";

interface UploadResponse {
  bucket: string;
  key: string;
  size: number;
  contentType: string;
  originalName: string;
}

const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB
const ALLOWED_EXTENSIONS = new Set(["pdf", "doc", "docx", "jpg", "jpeg", "png"]);

function formatFileSize(bytes: number) {
  if (bytes < 1024) {
    return `${bytes} B`;
  }
  if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toFixed(1)} KB`;
  }
  if (bytes < 1024 * 1024 * 1024) {
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  }
  return `${(bytes / (1024 * 1024 * 1024)).toFixed(1)} GB`;
}

export default function UploadCard() {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const router = useRouter();
  const { language } = useLanguage();
  const { user, refreshHistory } = useAuth();
  const [dragActive, setDragActive] = useState(false);
  const [stage, setStage] = useState<AnalysisStage>("idle");
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [analysisReportId, setAnalysisReportId] = useState<string | null>(null);
  const [analysisMessage, setAnalysisMessage] = useState<string | null>(null);
  const [bucketStatus, setBucketStatus] = useState<"loading" | "configured" | "missing" | "error">("loading");
  const [bucketName, setBucketName] = useState("");
  const [uploadState, setUploadState] = useState<"idle" | "uploading" | "analyzing" | "success" | "error">("idle");
  const [uploadInfo, setUploadInfo] = useState<UploadResponse | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const reset = useCallback(() => {
    setStage("idle");
    setSelectedFile(null);
    setAnalysisReportId(null);
    setAnalysisMessage(null);
    setUploadState("idle");
    setUploadInfo(null);
    setUploadError(null);
  }, []);

  const isAllowedFile = useCallback((file: File) => {
    const extension = file.name.split(".").pop()?.toLowerCase() ?? "";
    return extension.length > 0 && ALLOWED_EXTENSIONS.has(extension);
  }, []);

  const processFile = useCallback(async (file: File) => {
    if (!isAllowedFile(file)) {
      setUploadState("error");
      setUploadError("Unsupported file type. Please upload a PDF, DOC, JPG, JPEG, or PNG report.");
      setStage("idle");
      setSelectedFile(null);
      return;
    }

    if (file.size > MAX_FILE_SIZE_BYTES) {
      setUploadState("error");
      setUploadError("File is too large. Maximum size is 5 MB.");
      setStage("idle");
      setSelectedFile(null);
      return;
    }

    if (!user?.id) {
      setUploadState("error");
      setUploadError("Please sign in to analyze reports and save your history.");
      setStage("idle");
      setSelectedFile(null);
      return;
    }

    setSelectedFile(file.name);
    setStage("processing");
    setUploadState("uploading");
    setUploadError(null);
    setUploadInfo(null);
    setAnalysisMessage("Uploading report to secure storage...");
    setAnalysisReportId(null);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorBody = await response.json().catch(() => ({}));
        const message = typeof errorBody.error === "string" ? errorBody.error : "Upload failed.";
        throw new Error(message);
      }

      const data: UploadResponse = await response.json();
      setUploadInfo(data);
      setUploadState("analyzing");
      setAnalysisMessage("Generating AI insights...");

      const analysisResponse = await fetch("/api/reports/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user.id,
          bucket: data.bucket,
          key: data.key,
          originalName: data.originalName,
          contentType: data.contentType,
          size: data.size,
          language,
        }),
      });

      if (!analysisResponse.ok) {
        const errorBody = await analysisResponse.json().catch(() => ({}));
        const message =
          typeof errorBody.error === "string"
            ? errorBody.error
            : "Analysis failed. Please try again.";
        throw new Error(message);
      }

      const analysisData = (await analysisResponse.json()) as { reportId: string };
      setAnalysisReportId(analysisData.reportId);
      setAnalysisMessage("Analysis complete. Redirecting to detailed view...");
      setUploadState("success");
      setStage("complete");
      await refreshHistory();
      router.push(`/reports/${analysisData.reportId}`);
    } catch (error) {
      const message =
        error instanceof Error && error.message
          ? error.message
          : "Something went wrong during analysis.";
      setUploadState("error");
      setUploadError(message);
      setStage("idle");
      setSelectedFile(null);
      setAnalysisMessage(null);
      setAnalysisReportId(null);
    }
  }, [isAllowedFile, language, refreshHistory, router, user?.id]);

  const handleFiles = useCallback(
    (files: FileList | null) => {
      if (!files || files.length === 0) {
        return;
      }
      const file = files[0];
      void processFile(file);
    },
    [processFile]
  );

  const onInputChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      handleFiles(event.target.files);
    },
    [handleFiles]
  );

  const handleDrop = useCallback(
    (event: DragEvent<HTMLDivElement>) => {
      event.preventDefault();
      setDragActive(false);
      handleFiles(event.dataTransfer.files);
    },
    [handleFiles]
  );

  useEffect(() => {
    if (stage === "idle") {
      setAnalysisMessage(null);
    }
  }, [stage]);

  useEffect(() => {
    let cancelled = false;
    const verifyBucket = async () => {
      try {
        const response = await fetch("/api/s3-bucket");
        if (!response.ok) {
          throw new Error("Request failed");
        }
        const data: { configured: boolean; bucket?: string } = await response.json();
        if (cancelled) {
          return;
        }
        if (data.configured && data.bucket) {
          setBucketStatus("configured");
          setBucketName(data.bucket);
        } else {
          setBucketStatus("missing");
          setBucketName("");
        }
      } catch {
        if (!cancelled) {
          setBucketStatus("error");
          setBucketName("");
        }
      }
    };

    verifyBucket();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <section className="w-full rounded-3xl bg-white p-6 shadow-soft ring-1 ring-slate-100 sm:p-8">
      <div
        onDragOver={(event) => {
          event.preventDefault();
          setDragActive(true);
        }}
        onDragLeave={() => setDragActive(false)}
        onDrop={handleDrop}
        className={`flex flex-col items-center justify-center rounded-2xl border-2 border-dashed px-8 py-12 text-center transition ${
          dragActive
            ? "border-transparent bg-brand-gradient-soft"
            : "border-slate-200 bg-slate-50/60"
        }`}
      >
        {stage === "idle" && (
          <>
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-brand-gradient text-white shadow-soft">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-7 w-7"
              >
                <path d="M12 21v-7" />
                <path d="M7 14l5-5 5 5" />
                <path d="M4 11V9a4 4 0 014-4h8a4 4 0 014 4v2" />
              </svg>
            </div>
            <h2 className="mt-4 text-xl font-semibold text-slate-900">
              Drag & drop your medical report
            </h2>
            <p className="mt-2 text-sm text-slate-500">
              Supported formats: PDF, DOC, JPG, JPEG, and PNG. Files stay on your device until you choose to upload.
            </p>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => inputRef.current?.click()}
                className="cursor-pointer rounded-full bg-brand-gradient px-5 py-2 text-sm font-semibold text-white shadow-soft transition hover:-translate-y-0.5 hover:shadow-lg"
              >
                Browse files
              </button>
              <span className="text-xs uppercase tracking-wide text-slate-400">or</span>
              <span className="rounded-full bg-white px-4 py-2 text-xs font-medium text-slate-500 shadow-sm">
                Drop it here
              </span>
            </div>
            <input
              ref={inputRef}
              type="file"
              accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
              onChange={onInputChange}
              className="hidden"
            />
          </>
        )}

        {stage === "processing" && (
          <div className="flex flex-col items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-brand-gradient text-white shadow-soft opacity-90">
              <svg
                className="h-8 w-8 animate-spin"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
              >
                <path d="M12 3v3" />
                <path d="M12 18v3" />
                <path d="M3 12h3" />
                <path d="M18 12h3" />
                <path d="M5.6 5.6l2.1 2.1" />
                <path d="M16.3 16.3l2.1 2.1" />
                <path d="M18.4 5.6l-2.1 2.1" />
                <path d="M7.7 16.3l-2.1 2.1" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-900">
                {uploadState === "success" ? "Analysis ready" : "Analyzing your report..."}
              </p>
              {analysisMessage && (
                <p className="mt-1 text-xs text-slate-500">{analysisMessage}</p>
              )}
              {uploadInfo && (
                <p className="mt-2 text-xs text-slate-500">
                  Stored in {uploadInfo.bucket} as {uploadInfo.key} ({formatFileSize(uploadInfo.size)}).
                </p>
              )}
            </div>
            {selectedFile && (
              <span className="rounded-full bg-white px-4 py-1 text-xs font-medium text-slate-500 shadow-sm">
                {selectedFile}
              </span>
            )}
          </div>
        )}

        {stage === "complete" && (
          <div className="flex w-full flex-col items-center text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500 text-white shadow-soft">
              <svg
                className="h-8 w-8"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="mt-4 text-lg font-semibold text-slate-900">Analysis ready</h3>
            <p className="mt-1 text-sm text-slate-500">
              {analysisMessage ?? "Carelytic has prepared your personalised interpretation."}
            </p>
            {analysisReportId && (
              <button
                type="button"
                onClick={() => router.push(`/reports/${analysisReportId}`)}
                className="mt-4 rounded-full bg-brand-gradient px-4 py-2 text-sm font-semibold text-white shadow-soft transition hover:-translate-y-0.5 hover:shadow-lg"
              >
                View detailed analysis
              </button>
            )}
            {uploadInfo && (
              <p className="mt-3 text-center text-xs text-slate-500">
                Stored in {uploadInfo.bucket} as {uploadInfo.key} ({formatFileSize(uploadInfo.size)}).
              </p>
            )}
          </div>
        )}
      </div>
      {uploadError && (
        <div className="mt-4 rounded-2xl border border-rose-200 bg-rose-50 p-4 text-xs font-medium text-rose-700">
          {uploadError}
        </div>
      )}
      <div className="mt-4 rounded-2xl border border-slate-100 bg-slate-50/70 p-4 text-xs text-slate-500">
        {bucketStatus === "loading" && "Checking storage configuration..."}
        {bucketStatus === "configured" && (
          <span>
            Connected to Cloudflare R2 bucket <span className="font-semibold text-slate-600">{bucketName}</span>.
          </span>
        )}
        {bucketStatus === "missing" && (
          <span className="text-amber-600">No S3 bucket found. Set S3_BUCKET in your environment variables.</span>
        )}
        {bucketStatus === "error" && (
          <span className="text-rose-600">Could not verify the bucket. Check the `/api/s3-bucket` route.</span>
        )}
      </div>

      {stage === "complete" && (
        <div className="mt-8">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <button
              type="button"
              className="rounded-full border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-600 transition hover:border-slate-300 hover:text-slate-900"
              onClick={reset}
            >
              Analyze another report
            </button>
            {analysisReportId && (
              <button
                type="button"
                className="rounded-full bg-brand-gradient px-4 py-2 text-xs font-semibold text-white shadow-soft transition hover:-translate-y-0.5 hover:shadow-lg"
                onClick={() => router.push(`/reports/${analysisReportId}`)}
              >
                View analysis again
              </button>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
