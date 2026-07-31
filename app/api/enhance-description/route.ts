import Groq from "groq-sdk";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const apiKey = process.env.NEXT_PUBLIC_GROQ_API;

  // Guard: make sure the key is present
  if (!apiKey) {
    console.error("[enhance-description] NEXT_PUBLIC_GROQ_API is not set.");
    return NextResponse.json(
      { error: "AI service is not configured. NEXT_PUBLIC_GROQ_API missing." },
      { status: 500 }
    );
  }

  // Initialize inside handler so it reads the env var at request time
  const groq = new Groq({ apiKey });

  try {
    const body = await req.json();
    const rawText: string = body?.rawText ?? "";

    if (!rawText || rawText.trim().length < 5) {
      return NextResponse.json(
        { error: "Please enter at least a few words to enhance." },
        { status: 400 }
      );
    }

    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        {
          role: "system",
          content: `You are an AI assistant that helps citizens report civic infrastructure issues clearly and professionally.

Your job is to rewrite the user's raw observation into a clear, structured, professional description that a city official or department can immediately understand and act on.

Guidelines:
- Keep the original meaning and facts intact.
- Write in third person, objective, factual tone.
- Include what the issue is, where it is (if mentioned), how severe it appears, and any safety or traffic impact.
- Use 2-4 clear sentences. Do not use bullet points.
- Do not invent details not mentioned by the user.
- Do not add a title or heading — only the description text.
- Keep it concise but complete (60-120 words ideally).`,
        },
        {
          role: "user",
          content: `Rewrite the following raw civic issue observation into a professional report description:\n\n"${rawText.trim()}"`,
        },
      ],
      temperature: 0.4,
      max_tokens: 300,
    });

    const enhanced = completion.choices[0]?.message?.content?.trim() ?? "";

    if (!enhanced) {
      return NextResponse.json(
        { error: "AI did not return a result. Please try again." },
        { status: 500 }
      );
    }

    return NextResponse.json({ enhanced });
  } catch (err: any) {
    // Surface the real error message in dev so it's diagnosable
    const detail = err?.message ?? String(err);
    console.error("[enhance-description] Groq error:", detail);

    return NextResponse.json(
      {
        error: `AI service error: ${detail}`,
      },
      { status: 500 }
    );
  }
}
