import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
const CHARACTER_LIMIT = 3000;

function cleanGeneratedText(text: string): string {
  return text
    .replace(/\*\*|__|[*#>]/g, "")
    .replace(/\n\s*\n/g, "\n")
    .trim();
}

async function generateContentForLinkedIn(
  prompt: string,
  maxRetries = 3,
  delayMs = 1000
): Promise<string> {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro-001" });

  const basePrompt = `
    You are a professional LinkedIn content strategist.

    Generate a LinkedIn post based on the following topic:

    "${prompt}"

    Requirements:
    - Include relevant emojis to enhance expression, but keep it tasteful and professional.
    - Keep the total post under ${CHARACTER_LIMIT} characters, including emojis.
    - Start with a strong, attention-grabbing hook in the first 2 lines.
    - Use short paragraphs for readability.
    - Maintain a professional tone (no slang or overly casual language).
    - Add a clear and relevant Call-To-Action (CTA) at the end, if appropriate.
    - Only use relevant hashtags.
    - Content must be 100% suitable for LinkedIn.
    
    Format:
    - Return plain text only.
    - Do not use markdown or special symbols like *, __, ##, etc.
    - Do not explain the output.

    Just return the final post as-is.
  `;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const result = await model.generateContent(basePrompt);
      let text =
        result.response?.candidates?.[0]?.content?.parts?.[0]?.text ||
        "No content generated";

      if (text.length > CHARACTER_LIMIT) {
        console.warn(
          `Generated content exceeds ${CHARACTER_LIMIT} characters. Trimming output.`
        );
        text = text.slice(0, CHARACTER_LIMIT);
      }

      return cleanGeneratedText(text);
    } catch (error: unknown) {
      if (error instanceof Error) {
        if (attempt === maxRetries) {
          console.error(`All retries failed: ${error.message}`);
          return `Fallback content: Unable to generate content right now.`;
        }
        const waitTime = delayMs * Math.pow(2, attempt - 1);
        console.warn(
          `Attempt ${attempt} failed: ${error.message}. Retrying in ${waitTime}ms...`
        );
        await new Promise((resolve) => setTimeout(resolve, waitTime));
      } else {
        console.error("An unknown error occurred:", error);
      }
    }
  }

  return "Fallback content: Generation failed after all retries.";
}

export { generateContentForLinkedIn as generateContent };
