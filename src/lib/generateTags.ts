import { openai } from "@/lib/openai";

export async function generateTags(text: string): Promise<string[]> {
    const prompt = `
   You are a content tagging assistant for a travel blog, where articles are organized by city. Your task is to read the article text below and generate 3–5 concise, high-level tags that capture the core themes of the content relevant to the city's offerings. The tags should guide users about particular aspects they are interested in exploring within the city.

✅ The tags must:
- Be lowercase
- Be a single word each (no hyphens or multi-word phrases)
- Represent clearly distinct general concepts or themes relevant to city exploration

❌ Do NOT include:
- Any city, country, or region names, as articles are already categorized by city
- Dates, numbers, or years
- Brand, business, or product names
- Redundant or overlapping tags (e.g., "food" and "culinary")

Return only a valid JSON array of lowercase strings, with no explanation, no code block, no markdown, and no surrounding text.
    
    ${text.slice(0, 1500)}
    `;    

  const response = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [{ role: "user", content: prompt }],
    temperature: 0.5,
  });

  const raw = response.choices[0].message.content?.trim();

  try {
    const tags = JSON.parse(raw!);
    if (Array.isArray(tags)) {
      return tags.map((t) => t.toLowerCase().trim()).slice(0, 5);
    }
  } catch {
    console.warn("Could not parse tags:", raw);
  }
  return [];
}
