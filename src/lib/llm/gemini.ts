import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
const CHARACTER_LIMIT = 3000;

function cleanGeneratedText(text: string): string {
  return text
    .replace(/\*\*|__|[*#>]/g, "")
    .replace(/\n\s*\n/g, "\n")
    .trim();
}

async function validateLinkedInPost(content: string): Promise<boolean> {
  const validationModel = genAI.getGenerativeModel({
    model: "gemini-1.5-pro-001",
  });

  const validationPrompt = `
    You are an expert in LinkedIn content optimization. Validate the following LinkedIn post against these criteria:

    - Must be under ${CHARACTER_LIMIT} characters.
    - Should be engaging in the first 2 lines to capture attention.
    - Should maintain a professional tone (no slang, overly casual language).
    - Should have proper structure (short paragraphs, formatted for easy reading).
    - If possible, should include a Call-To-Action (CTA) at the end.
    - Avoids offensive, misleading, or irrelevant content.
    - If hashtags are present, they should be relevant.
    - Should be suitable for posting on LinkedIn.

    Return "VALID" if the post meets all criteria, otherwise return "INVALID".

    --- Post Start ---
    ${content}
    --- Post End ---
  `;

  try {
    const result = await validationModel.generateContent(validationPrompt);
    const responseText =
      result.response?.candidates?.[0]?.content?.parts?.[0]?.text || "";

    return responseText.trim().toUpperCase() === "VALID";
  } catch (error) {
    console.error("Validation failed:", error);
    return false;
  }
}

async function generateContentForLinkedIn(
  prompt: string,
  maxRetries = 3,
  delayMs = 1000
): Promise<string> {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro-001" });

      const refinedPrompt = `
        Generate a LinkedIn post based on the following topic:

        ${prompt}

        - The response should be in plain text with no markdown, symbols, or formatting characters.
        - Do not use *, **, __, ##, or any heading symbols.
        - Use short paragraphs to make it easy to read.
      `;

      const result = await model.generateContent(refinedPrompt);
      let text =
        result.response?.candidates?.[0]?.content?.parts?.[0]?.text ||
        "No content generated";

      if (text.length > CHARACTER_LIMIT) {
        console.warn(
          `Generated content exceeds ${CHARACTER_LIMIT} characters. Trimming output.`
        );
        text = text.slice(0, CHARACTER_LIMIT);
      }

      text = cleanGeneratedText(text);

      const isValid = await validateLinkedInPost(text);
      if (!isValid)
        throw new Error("Generated content failed LinkedIn validation.");

      return text;
    } catch (error: unknown) {
      if (error instanceof Error) {
        if (attempt === maxRetries) {
          console.error(`All retries failed: ${error.message}`);
          return `Fallback content: Unable to generate due to validation failure. Please try again later.`;
        }
        const waitTime = delayMs * Math.pow(2, attempt - 1);
        console.warn(
          `Attempt ${attempt} failed: ${error.message}. Retrying in ${waitTime}ms...`
        );
      } else {
        console.error("An unknown error occurred:", error);
      }
      await new Promise((resolve) =>
        setTimeout(resolve, delayMs * Math.pow(2, attempt - 1))
      );
    }
  }
  return "Fallback content: Generation failed after all retries.";
}

export { generateContentForLinkedIn as generateContent };
