import { openai } from "@/lib/openai";

export type DescriptionResult = {
  success: boolean;
  description: string;
  error?: string;
};

// Helper to summarize one part
async function summarizeChunk(
  chunk: string,
  model = "gpt-3.5-turbo"
): Promise<string> {
  const prompt = `
Summarize the following travel blog excerpt in 2–3 sentences. Highlight unique attractions, food, tips, or practical info:

${chunk}
`;

  const res = await openai.chat.completions.create({
    model,
    messages: [{ role: "user", content: prompt }],
    temperature: 0.6,
  });

  return res.choices[0].message.content?.trim() ?? "";
}

// Main function
export async function generateDescription(
  text: string
): Promise<DescriptionResult> {
  if (!text.trim()) {
    return {
      success: false,
      description: "",
      error: "Input text is empty",
    };
  }

  try {
    const totalLength = text.length;
    const part1 = text.slice(0, Math.floor(totalLength / 3));
    const part2 = text.slice(
      Math.floor(totalLength / 3),
      Math.floor((2 * totalLength) / 3)
    );
    const part3 = text.slice(Math.floor((2 * totalLength) / 3));

    const [sum1, sum2, sum3] = await Promise.all([
      summarizeChunk(part1),
      summarizeChunk(part2),
      summarizeChunk(part3),
    ]);
    
    const finalPrompt = `
You are a travel content assistant. Based on the following three partial summaries of a travel blog article, write a single, engaging 100–150 word description.

The description should:
- Reflect the full scope of the article
- Include specific city names, places, tips, and cultural highlights
- Help travelers quickly understand what they'll learn or experience

Summaries:
- ${sum1}
- ${sum2}
- ${sum3}
`;

    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [{ role: "user", content: finalPrompt }],
      temperature: 0.6,
    });

    const description = response.choices[0].message.content?.trim() ?? "";

    return { success: true, description };
  } catch (error: any) {
    console.error("Error generating description:", error.message);
    return {
      success: false,
      description: "",
      error: `OpenAI API error: ${error.message}`,
    };
  }
}
