import { NextResponse } from "next/server";
import { postToLinkedIn } from "@/lib/linkedin/client";

export async function POST(request: Request) {
  const { content } = await request.json();

  try {
    await postToLinkedIn(content);
    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    let errorMessage = "An unexpected error occurred";
    if (error instanceof Error) {
      errorMessage = error.message;
    }

    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: 500 }
    );
  }
}