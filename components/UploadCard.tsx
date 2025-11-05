"use client";

import type { ChangeEvent, DragEvent } from "react";
import { useCallback, useEffect, useRef, useState } from "react";

type AnalysisStage = "idle" | "processing" | "complete";

interface AnalysisResult {
  metric: string;
  value: string;
  status: "Normal" | "Attention";
  insight: string;
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
  const [dragActive, setDragActive] = useState(false);
  const [stage, setStage] = useState<AnalysisStage>("idle");
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [results, setResults] = useState<AnalysisResult[]>([]);

  const reset = useCallback(() => {
    setStage("idle");
    setSelectedFile(null);
    setResults([]);
    if (analysisTimer.current) {
      clearTimeout(analysisTimer.current);
    }
  }, []);

  const simulateAnalysis = useCallback((file: File) => {
    setSelectedFile(file.name);
    setStage("processing");

    if (analysisTimer.current) {
      clearTimeout(analysisTimer.current);
    }

    analysisTimer.current = setTimeout(() => {
      setResults(
        mockAnalysis.map((entry) => ({
          ...entry,
        }))
      );
      setStage("complete");
    }, 2200);
  }, []);

  const handleFiles = useCallback(
    (files: FileList | null) => {
      if (!files || files.length === 0) {
        return;
      }
      const file = files[0];
      simulateAnalysis(file);
    },
    [simulateAnalysis]
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

  useEffect(
    () => () => {
      if (analysisTimer.current) {
        clearTimeout(analysisTimer.current);
      }
    },
    []
  );

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
                className="rounded-full bg-brand-gradient px-5 py-2 text-sm font-semibold text-white shadow-soft transition hover:-translate-y-0.5 hover:shadow-lg"
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
          </div>
        )}
      </div>

      {stage === "complete" && (
        <div className="mt-8">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h4 className="text-lg font-semibold text-slate-900">Report summary</h4>
            <button
              type="button"
              className="rounded-full border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-600 transition hover:border-slate-300 hover:text-slate-900"
              onClick={reset}
            >
              Analyze another
            </button>
          </div>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
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
