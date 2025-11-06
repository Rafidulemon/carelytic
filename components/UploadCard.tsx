"use client";

import type { ChangeEvent, DragEvent } from "react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useAuth } from "./AuthProvider";

type AnalysisStage = "idle" | "processing" | "complete";

interface AnalysisResult {
  metric: string;
  value: string;
  status: "Normal" | "Attention";
  insight: string;
}

interface UploadResponse {
  bucket: string;
  key: string;
  size: number;
  contentType: string;
  originalName: string;
}

const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB

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

const mockAnalysis: AnalysisResult[] = [
  {
    metric: "Hemoglobin",
    value: "13.5 g/dL",
    status: "Normal",
    insight: "Healthy red blood cell levels.",
  },
  {
    metric: "White Blood Cells",
    value: "11.2 k/µL",
    status: "Attention",
    insight: "Slight elevation — review for potential infection or stress.",
  },
  {
    metric: "Platelets",
    value: "295 k/µL",
    status: "Normal",
    insight: "Platelet count within expected range.",
  },
  {
    metric: "Glucose (Fasting)",
    value: "104 mg/dL",
    status: "Attention",
    insight: "Borderline high — consider lifestyle adjustments.",
  },
];

export default function UploadCard() {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const analysisTimer = useRef<NodeJS.Timeout | null>(null);
  const { user, addHistory, consumeCredits, addCredits } = useAuth();
  const [dragActive, setDragActive] = useState(false);
  const [stage, setStage] = useState<AnalysisStage>("idle");
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [results, setResults] = useState<AnalysisResult[]>([]);
  const historyLoggedRef = useRef(false);
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [paymentState, setPaymentState] = useState<"idle" | "processing" | "success" | "failed">("idle");
  const [paymentMessage, setPaymentMessage] = useState("");
  const [bucketStatus, setBucketStatus] = useState<"loading" | "configured" | "missing" | "error">("loading");
  const [bucketName, setBucketName] = useState("");
  const [uploadState, setUploadState] = useState<"idle" | "uploading" | "success" | "error">("idle");
  const [uploadInfo, setUploadInfo] = useState<UploadResponse | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const reset = useCallback(() => {
    setStage("idle");
    setSelectedFile(null);
    setResults([]);
    historyLoggedRef.current = false;
    setIsUnlocked(false);
    setPaymentState("idle");
    setPaymentMessage("");
    setUploadState("idle");
    setUploadInfo(null);
    setUploadError(null);
    if (analysisTimer.current) {
      clearTimeout(analysisTimer.current);
    }
  }, []);

  const processFile = useCallback(async (file: File) => {
    if (file.size > MAX_FILE_SIZE_BYTES) {
      setUploadState("error");
      setUploadError("File is too large. Maximum size is 5 MB.");
      setStage("idle");
      setSelectedFile(null);
      return;
    }

    setSelectedFile(file.name);
    setStage("processing");
    historyLoggedRef.current = false;
    setUploadState("uploading");
    setUploadError(null);
    setUploadInfo(null);

    if (analysisTimer.current) {
      clearTimeout(analysisTimer.current);
    }

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
      setUploadState("success");

      analysisTimer.current = setTimeout(() => {
        setResults(
          mockAnalysis.map((entry) => ({
            ...entry,
          }))
        );
        setStage("complete");
      }, 2200);
    } catch (error) {
      const message = error instanceof Error && error.message ? error.message : "Failed to upload file.";
      setUploadState("error");
      setUploadError(message);
      setStage("idle");
      setSelectedFile(null);
    }
  }, []);

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

  const reportCostBDT = 10;
  const reportCredits = 10;
  const hasCredits = useMemo(() => (user?.credits ?? 0) >= reportCredits, [user?.credits]);

  const unlockWithCredits = () => {
    if (!user) {
      setPaymentState("failed");
      setPaymentMessage("Please log in or create an account to use credits.");
      return;
    }
    const ok = consumeCredits(reportCredits);
    if (ok) {
      setPaymentState("success");
      setPaymentMessage(`10 credits redeemed. Report unlocked.`);
      setIsUnlocked(true);
    } else {
      setPaymentState("failed");
      setPaymentMessage("Not enough credits. Purchase a subscription or pay as you go.");
    }
  };

  const simulatePayment = (method: "bkash" | "nagad" | "card") => {
    setPaymentState("processing");
    setPaymentMessage(
      method === "card"
        ? "Processing secure card payment..."
        : `Redirecting to ${method === "bkash" ? "bKash" : "Nagad"}...`
    );
    if (!user) {
      // simulate adding guest payment? We'll allow pay-as-you-go w/out login but prompt sign-in
      setTimeout(() => {
        setPaymentState("failed");
        setPaymentMessage("Please log in to complete payment and view your report.");
      }, 1200);
      return;
    }
    setTimeout(() => {
      setPaymentState("success");
      setPaymentMessage("Payment successful. Report unlocked!");
      setIsUnlocked(true);
    }, 1500);
  };

  const addTopUpCredits = (amount: number) => {
    if (!user) {
      setPaymentState("failed");
      setPaymentMessage("Please log in to purchase subscription credits.");
      return;
    }
    addCredits(amount);
    setPaymentState("success");
    setPaymentMessage(`Added ${amount} credits to your balance.`);
  };

  useEffect(
    () => () => {
      if (analysisTimer.current) {
        clearTimeout(analysisTimer.current);
      }
    },
    []
  );

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

  useEffect(() => {
    if (stage !== "complete" || !selectedFile || results.length === 0 || historyLoggedRef.current) {
      return;
    }
    if (!user) {
      historyLoggedRef.current = true;
      return;
    }

    const attentionItems = results.filter((entry) => entry.status === "Attention");
    const summary =
      attentionItems.length > 0
        ? `${attentionItems.length} value${attentionItems.length === 1 ? "" : "s"} flagged for follow-up.`
        : "All metrics remain within the expected ranges.";

    addHistory({
      id: `report-${Date.now()}`,
      title: selectedFile.replace(/\.[^/.]+$/, "").slice(0, 48) || "Uploaded report",
      date: new Date().toISOString().slice(0, 10),
      summary,
      highlights: results.slice(0, 3).map((entry) => `${entry.metric}: ${entry.value} (${entry.status})`),
    });
    historyLoggedRef.current = true;
  }, [addHistory, results, selectedFile, stage, user]);

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
              Supported formats: PDF, JPG, and PNG. Files stay on your device until you choose to upload.
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
              accept=".pdf,.jpg,.jpeg,.png"
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
              <p className="text-sm font-semibold text-slate-900">Analyzing your report...</p>
              <p className="mt-1 text-xs text-slate-500">
                Carelytic is extracting key metrics and comparing them with healthy ranges.
              </p>
              {(uploadState === "uploading" || uploadState === "success") && (
                <p className="mt-2 text-xs text-slate-500">
                  {uploadState === "uploading" ? "Uploading to Cloudflare R2 storage..." : "Upload complete. Generating insights..."}
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
          <div className="flex w-full flex-col items-center">
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
            <h3 className="mt-4 text-lg font-semibold text-slate-900">Insights ready</h3>
            <p className="mt-1 text-sm text-slate-500">
              Carelytic found {results.filter((r) => r.status === "Attention").length} items that may need a closer look.
            </p>
            {selectedFile && (
              <span className="mt-3 rounded-full bg-white px-4 py-1 text-xs font-medium text-slate-500 shadow-sm">
                {selectedFile}
              </span>
            )}
            {uploadInfo && (
              <p className="mt-3 text-center text-xs text-slate-500">
                Stored in {uploadInfo.bucket} as {uploadInfo.key} ({formatFileSize(uploadInfo.size)})
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
            <div>
              <h4 className="text-lg font-semibold text-slate-900">Report summary</h4>
              <p className="text-xs text-slate-500">
                Unlock to view AI insights. Cost: BDT {reportCostBDT} / {reportCredits} credits.
              </p>
            </div>
            <button
              type="button"
              className="rounded-full border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-600 transition hover:border-slate-300 hover:text-slate-900"
              onClick={reset}
            >
              Analyze another
            </button>
          </div>
          {!isUnlocked && (
            <div className="mt-6 grid gap-4 rounded-3xl border border-slate-100 bg-slate-50/70 p-5 sm:grid-cols-[1.1fr_1fr]">
              <div>
                <h5 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
                  Unlock options
                </h5>
                <p className="mt-2 text-sm text-slate-600">
                  Pay-as-you-go price is <span className="font-semibold">BDT {reportCostBDT}</span>. Subscribers can
                  redeem <span className="font-semibold">{reportCredits} credits</span> per report.
                </p>
                <div className="mt-4 flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={unlockWithCredits}
                    disabled={!hasCredits}
                    className="inline-flex items-center justify-center rounded-full bg-brand-gradient px-4 py-2 text-sm font-semibold text-white shadow-soft transition hover:-translate-y-0.5 hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    Unlock with credits ({reportCredits})
                  </button>
                  {!hasCredits && (
                    <span className="text-xs text-amber-600">
                      You have {user?.credits ?? 0} credits. Buy a subscription to top up.
                    </span>
                  )}
                </div>
                <div className="mt-6 space-y-3">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Pay BDT {reportCostBDT}</p>
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => simulatePayment("bkash")}
                      className="rounded-full border border-rose-200 bg-rose-50 px-4 py-2 text-sm font-semibold text-rose-600 transition hover:border-rose-300 hover:text-rose-700"
                    >
                      Pay with bKash
                    </button>
                    <button
                      type="button"
                      onClick={() => simulatePayment("nagad")}
                      className="rounded-full border border-orange-200 bg-orange-50 px-4 py-2 text-sm font-semibold text-orange-600 transition hover:border-orange-300 hover:text-orange-700"
                    >
                      Pay with Nagad
                    </button>
                    <button
                      type="button"
                      onClick={() => simulatePayment("card")}
                      className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-600 transition hover:border-slate-300 hover:text-slate-900"
                    >
                      Pay with card
                    </button>
                  </div>
                </div>
              </div>
              <div className="rounded-2xl border border-slate-100 bg-white p-4 text-sm text-slate-600 shadow-sm">
                <h6 className="text-sm font-semibold text-slate-900">Current balance</h6>
                <p className="mt-1 text-xs text-slate-500">
                  {user ? (
                    <>
                      Plan:{" "}
                      <span className="font-semibold text-slate-700 uppercase">
                        {user.subscriptionPlan === "payg"
                          ? "Pay as you go"
                          : user.subscriptionPlan === "monthly"
                            ? "Monthly subscriber"
                            : "Yearly subscriber"}
                      </span>
                    </>
                  ) : (
                    "Sign in to track credits and history."
                  )}
                </p>
                <p className="mt-3 text-3xl font-bold text-slate-900">
                  {user ? user.credits : 0}
                  <span className="ml-2 text-sm font-semibold text-slate-500">credits</span>
                </p>
                <p className="mt-2 text-xs text-slate-500">
                  Need credits?{" "}
                  <button
                    type="button"
                    className="font-semibold text-slate-900 underline"
                    onClick={() => addTopUpCredits(120)}
                  >
                    Try monthly subscription (adds 120)
                  </button>
                </p>
                {paymentMessage && (
                  <p
                    className={`mt-3 text-xs font-semibold ${
                      paymentState === "success"
                        ? "text-emerald-600"
                        : paymentState === "processing"
                          ? "text-slate-500"
                          : "text-rose-600"
                    }`}
                  >
                    {paymentMessage}
                  </p>
                )}
              </div>
            </div>
          )}
          <div className={`mt-4 grid gap-3 sm:grid-cols-2 ${!isUnlocked ? "pointer-events-none opacity-50 blur-[1px]" : ""}`}>
            {results.map((item) => (
              <article
                key={item.metric}
                className="group rounded-2xl border border-slate-100 bg-slate-50/60 p-4 transition hover:border-transparent hover:bg-white hover:shadow-lg"
              >
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold text-slate-900">{item.metric}</p>
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${
                      item.status === "Normal"
                        ? "bg-emerald-50 text-emerald-600"
                        : "bg-amber-50 text-amber-600"
                    }`}
                  >
                    {item.status}
                  </span>
                </div>
                <p className="mt-2 text-sm font-medium text-slate-600">{item.value}</p>
                <p className="mt-2 text-xs leading-relaxed text-slate-500">{item.insight}</p>
              </article>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
