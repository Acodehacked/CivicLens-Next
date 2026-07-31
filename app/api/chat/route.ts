import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    const apiKey = process.env.NEXT_PUBLIC_GROQ_API2 || process.env.NEXT_PUBLIC_GROQ_API;

    if (!apiKey) {
      return NextResponse.json(
        { error: "Groq API key (NEXT_PUBLIC_GROQ_API2) is not configured" },
        { status: 500 }
      );
    }

    const systemPrompt = {
      role: "system",
      content: `You are CivicAI, the AI Municipal Assistant for CivicLens — an AI-powered civic issue reporting and triage platform.

Key Information & Rules:
- CivicLens uses AI Computer Vision to detect, score severity (0-100), and auto-route infrastructure defects.
- 5 Official Municipal Departments:
  1. Road Maintenance Department (Potholes, Road damage, Road inspections)
  2. Sanitation & Waste Management Department (Garbage, Illegal dumping, Street cleaning)
  3. Drainage & Stormwater Department (Waterlogging, Blocked drains, Stormwater infrastructure)
  4. Parks & Tree Maintenance Department (Fallen Trees, Tree removal, Tree maintenance)
  5. Disaster Management & Emergency Response Department (Floods, Emergency response, Public safety incidents)
- Citizen Actions:
  - Submit a report: /report
  - Explore community map: /community-map
- Instructions:
  - Be helpful, modern, polite, and concise (max 3-4 sentences per answer).
  - Use markdown formatting with relevant emojis.
  - Suggest visiting /report or /community-map when appropriate.`,
    };

    const groqPayload = {
      model: "llama-3.3-70b-versatile",
      messages: [systemPrompt, ...(messages || [])],
      temperature: 0.6,
      max_tokens: 450,
    };

    let response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(groqPayload),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Groq llama-3.3-70b-versatile API Error:", errorText);
      return NextResponse.json(
        { error: "Groq API error", details: errorText },
        { status: response.status }
      );
    }

    const data = await response.json();
    const replyContent = data.choices?.[0]?.message?.content || "I am currently unable to process your request. Please try reporting directly via /report.";

    return NextResponse.json({ reply: replyContent });
  } catch (error: any) {
    console.error("Error in chat API route:", error);
    return NextResponse.json(
      { error: "Internal server error", details: error?.message },
      { status: 500 }
    );
  }
}
