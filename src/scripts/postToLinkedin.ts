import { generateImage } from "../lib/image/generate";
import { postToLinkedIn } from "../lib/linkedin/client";

async function run() {
  const prompt = "Generate a professional image for LinkedIn about AI trends.";
  const imageUrl = await generateImage(prompt);
  await postToLinkedIn(imageUrl);
  console.log("Posted image to LinkedIn:", imageUrl);
}

run().catch(console.error);