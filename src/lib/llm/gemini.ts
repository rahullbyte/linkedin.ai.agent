import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

async function generateContentWithRetry(prompt: string, maxRetries = 3, delayMs = 1000): Promise<string> {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro-001" });
      const result = await model.generateContent(prompt);
      const text = result.response?.candidates?.[0]?.content?.parts?.[0]?.text || "No content generated";
      if (text && text !== "No content generated") {
        return text;
      }
      throw new Error("Invalid content response");
    } catch (error: any) {
      if (attempt === maxRetries) {
        console.error(`All retries failed: ${error.message}`);
        return `Fallback content: Unable to generate due to server overload. Please try again later.`;
      }
      const waitTime = delayMs * Math.pow(2, attempt - 1); // Exponential backoff
      console.warn(`Attempt ${attempt} failed: ${error.message}. Retrying in ${waitTime}ms...`);
      await new Promise((resolve) => setTimeout(resolve, waitTime));
    }
  }
  return "Fallback content: Generation failed after all retries.";
}

export { generateContentWithRetry as generateContent };