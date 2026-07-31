import { NextResponse } from "next/server";
import { ImageSegregatorUrl } from "@/constants/lib";

// Proxies to the FastAPI backend's read-only POST /similar-reports - same
// reasoning as /api/process-report (avoid depending on that service's CORS
// config, keep backend failures logged server-side).
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
    const res = await fetch(`${ImageSegregatorUrl}/similar-reports`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        image_url: body.image_url,
        latitude: body.latitude,
        longitude: body.longitude,
        limit: typeof body.limit === "number" ? body.limit : 5,
      }),
    });

    const data = await res.json().catch(() => null);

    if (!res.ok) {
      console.error("[similar-reports] backend error:", res.status, data);
      return NextResponse.json({ matches: [] }, { status: 200 });
    }

    return NextResponse.json(data);
  } catch (err) {
    console.error("[similar-reports] fetch failed:", err);
    return NextResponse.json({ matches: [] }, { status: 200 });
  }
}
