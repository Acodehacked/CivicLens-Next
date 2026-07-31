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

    const data = await res.json().catch(() => null);

    if (!res.ok) {
      console.error("[process-report] backend error:", res.status, data);
      return NextResponse.json(
        {
          error:
            data?.detail ??
            "No civic issue could be detected in this image. Try a clearer photo.",
        },
        { status: res.status }
      );
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
