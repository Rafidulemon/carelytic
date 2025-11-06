export type MetricStatus = "normal" | "attention";

export interface ReportMetric {
  id: "hemoglobin" | "wbc" | "platelets" | "glucose";
  value: string;
  status: MetricStatus;
  range: string;
}

export interface ReportData {
  id: string;
  translationKey: string;
  metrics: ReportMetric[];
}

export const mockReport: ReportData = {
  id: "cbc-sample",
  translationKey: "report.sample",
  metrics: [
    {
      id: "hemoglobin",
      value: "13.5 g/dL",
      status: "normal",
      range: "12.0 – 16.0 g/dL",
    },
    {
      id: "wbc",
      value: "11.2 k/µL",
      status: "attention",
      range: "4.0 – 10.0 k/µL",
    },
    {
      id: "platelets",
      value: "295 k/µL",
      status: "normal",
      range: "150 – 400 k/µL",
    },
    {
      id: "glucose",
      value: "104 mg/dL",
      status: "attention",
      range: "70 – 99 mg/dL",
    },
  ],
};
