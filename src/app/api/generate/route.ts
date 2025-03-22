import { NextResponse } from "next/server";
import { generateContent } from "@/lib/llm/gemini";

export async function POST(request: Request) {
  try {
    const { prompt } = await request.json();
    if (!prompt) {
      return NextResponse.json({ error: "Prompt is required" }, { status: 400 });
    }
    const content = await generateContent(prompt);
    return NextResponse.json({ content });
  } catch (error: unknown) {
    let errorMessage = "An unexpected error occurred";
    if (error instanceof Error) {
      errorMessage = error.message;
    }

    return NextResponse.json(
      { error: `Failed to generate content: ${errorMessage}` },
      { status: 500 }
    );
  }
}