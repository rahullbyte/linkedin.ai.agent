import { NextResponse } from "next/server";
import { postToLinkedIn } from "@/lib/linkedin/client";

export async function POST(request: Request) {
  const { content, imageUrl } = await request.json();
  try {
    await postToLinkedIn(content, imageUrl);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}