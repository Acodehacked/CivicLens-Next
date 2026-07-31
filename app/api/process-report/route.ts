import { NextResponse } from "next/server";
import { ImageSegregatorUrl } from "@/constants/lib";

// Proxies to the FastAPI detection backend's POST /process-report instead of
// calling it directly from the browser - sidesteps depending on that
// service's CORS config matching whatever origin this app is deployed on,
// and gives us one place to log backend failures server-side.
export async function POST(request: Request) {
  const body = await request.json().catch(() => null);

  if (
    !body?.image_url ||
    typeof body.latitude !== "number" ||
    typeof body.longitude !== "number"
  ) {
    return NextResponse.json(
      { error: "image_url, latitude, and longitude are required." },
      { status: 400 }
    );
  }

  try {
    const res = await fetch(`${ImageSegregatorUrl}/process-report`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        image_url: body.image_url,
        latitude: body.latitude,
        longitude: body.longitude,
        reporter_id: body.reporter_id ?? null,
      }),
    });

    const rawBody = await res.text();
    const data = (() => {
      try {
        return JSON.parse(rawBody);
      } catch {
        return null;
      }
    })();

    if (!res.ok) {
      console.error("[process-report] backend error:", res.status, rawBody);

      // 422 is the documented "no issue detected in this image" response -
      // a real, expected outcome, not a failure. Anything else (5xx, or a
      // non-JSON body like a bare "Internal Server Error") means the
      // backend itself broke, which is a different problem and shouldn't
      // be described to the user as "no issue detected".
      const error =
        res.status === 422
          ? (data?.detail ?? "No civic issue could be detected in this image. Try a clearer photo.")
          : "The detection service hit an unexpected error processing this image. Please try again in a moment.";

      return NextResponse.json({ error }, { status: res.status });
    }

    return NextResponse.json(data);
  } catch (err) {
    console.error("[process-report] fetch failed:", err);
    return NextResponse.json(
      { error: "Could not reach the detection service. Please try again." },
      { status: 502 }
    );
  }
}
