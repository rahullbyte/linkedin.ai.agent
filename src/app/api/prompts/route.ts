// src/api/prompts/route.ts
import { NextRequest, NextResponse } from "next/server";
import sqlite3 from "sqlite3";
import { open } from "sqlite";

// Define the shape of a row from the prompts table
interface PromptRow {
  text: string;
}

// Initialize SQLite database
async function getDb() {
  return open({
    filename: "./prompts.db",
    driver: sqlite3.Database,
  });
}

const loadPrompts = async (): Promise<string[]> => {
  const db = await getDb();
  await db.run(
    "CREATE TABLE IF NOT EXISTS prompts (id INTEGER PRIMARY KEY AUTOINCREMENT, text TEXT)"
  );
  const countResult = await db.get<{ count: number }>("SELECT COUNT(*) as count FROM prompts");

  if (!countResult || countResult.count === 0) {
    const defaultPrompts = [
      "Linkedin Motivational posts.",
    ];
    for (const prompt of defaultPrompts) {
      await db.run("INSERT INTO prompts (text) VALUES (?)", prompt);
    }
    return defaultPrompts;
  }
  const rows = await db.all<PromptRow[]>("SELECT text FROM prompts");
  return rows.map((row) => row.text);
};

const savePrompts = async (prompts: string[]) => {
  const db = await getDb();
  await db.run("DELETE FROM prompts");
  for (const prompt of prompts) {
    await db.run("INSERT INTO prompts (text) VALUES (?)", prompt);
  }
};

export async function GET() {
  const prompts = await loadPrompts();
  return NextResponse.json({ prompts });
}

export async function POST(req: NextRequest) {
  try {
    const { prompt } = await req.json();
    if (!prompt || typeof prompt !== "string") {
      return NextResponse.json(
        { error: "Prompt is required and must be a string" },
        { status: 400 }
      );
    }
    const prompts = await loadPrompts();
    prompts.push(prompt);
    await savePrompts(prompts);
    return NextResponse.json({ prompts }, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Failed to add prompt" },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    const { index, prompt } = await req.json();
    if (index === undefined || !prompt || typeof prompt !== "string") {
      return NextResponse.json(
        { error: "Index and prompt are required" },
        { status: 400 }
      );
    }
    const prompts = await loadPrompts();
    if (index < 0 || index >= prompts.length) {
      return NextResponse.json(
        { error: "Invalid index" },
        { status: 400 }
      );
    }
    prompts[index] = prompt;
    await savePrompts(prompts);
    return NextResponse.json({ prompts });
  } catch {
    return NextResponse.json(
      { error: "Failed to update prompt" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { index } = await req.json();
    if (index === undefined || typeof index !== "number") {
      return NextResponse.json(
        { error: "Index is required and must be a number" },
        { status: 400 }
      );
    }
    const prompts = await loadPrompts();
    if (index < 0 || index >= prompts.length) {
      return NextResponse.json(
        { error: "Invalid index" },
        { status: 400 }
      );
    }
    const updatedPrompts = prompts.filter((_, i) => i !== index);
    await savePrompts(updatedPrompts);
    return NextResponse.json({ prompts: updatedPrompts });
  } catch {
    return NextResponse.json(
      { error: "Failed to delete prompt" },
      { status: 500 }
    );
  }
}