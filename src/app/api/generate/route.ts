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
  } catch (error: any) {
    console.error("API Error:", error);
    return NextResponse.json(
      { error: `Failed to generate content: ${error.message}` },
      { status: 500 }
    );
  }
}