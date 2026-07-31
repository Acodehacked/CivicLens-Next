// Client-side helper for the CivicLens report-submission pipeline. Calls our
// own /api/process-report route (which proxies to the FastAPI detection
// backend) rather than that backend directly - see the route for why.

export type ProcessReportResult = {
  status: "merged" | "created";
  complaint_id: string;
  yolo_class: string | null;
  severity: string | null;
  department: string | null;
  priority_score: number;
  report_count: number;
};

export type ProcessReportInput = {
  imageUrl: string;
  latitude: number;
  longitude: number;
  reporterId: string | null;
};

export async function processReport(
  input: ProcessReportInput
): Promise<ProcessReportResult> {
  const res = await fetch("/api/process-report", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      image_url: input.imageUrl,
      latitude: input.latitude,
      longitude: input.longitude,
      reporter_id: input.reporterId,
    }),
  });

  const data = await res.json().catch(() => null);

  if (!res.ok) {
    throw new Error(
      data?.error ?? "The detection service could not process this image."
    );
  }

  return data as ProcessReportResult;
}

export type SimilarReportMatch = {
  id: string;
  yolo_class: string;
  severity: string;
  department: string;
  status: string;
  image_url: string;
  report_count: number;
  similarity: number;
  distance_meters: number;
};

export type SimilarReportsInput = {
  imageUrl: string;
  latitude: number;
  longitude: number;
  limit?: number;
};

// Read-only - makes no DB writes. Used purely to show "N similar reports
// nearby" alongside the real /process-report result; /process-report does
// its own duplicate check independently, so this is supplementary context,
// not what decides merge-vs-create.
export async function getSimilarReports(
  input: SimilarReportsInput
): Promise<SimilarReportMatch[]> {
  const res = await fetch("/api/similar-reports", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      image_url: input.imageUrl,
      latitude: input.latitude,
      longitude: input.longitude,
      limit: input.limit ?? 5,
    }),
  });

  if (!res.ok) return [];

  const data = await res.json().catch(() => null);
  return data?.matches ?? [];
}
