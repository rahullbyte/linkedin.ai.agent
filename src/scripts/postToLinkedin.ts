import { postToLinkedIn } from "../lib/linkedin/client";
import { generateContent } from "../lib/llm/gemini";
import fs from "fs";
import path from "path";

async function run() {
  try {
    const prompts = JSON.parse(fs.readFileSync(path.join(__dirname, "../data/prompts.json"), "utf8"));
    const randomPrompt = prompts[Math.floor(Math.random() * prompts.length)];
    console.log(`Selected prompt: ${randomPrompt}`);

    console.log("Waiting 2 minutes before generating content...");
    await new Promise((resolve) => setTimeout(resolve, 120000));

    const content = await generateContent(randomPrompt);
    console.log(`Generated content: ${content}`);

    await postToLinkedIn(content);
    console.log("Successfully posted to LinkedIn");
  } catch (error) {
    console.error("Error in LinkedIn posting process:", error);
  }
}

run().catch(console.error);