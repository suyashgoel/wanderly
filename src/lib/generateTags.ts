import { openai } from "@/lib/openai";

export async function generateTags(text: string): Promise<[string[], string[]]> {
  const prompt = `
You are a content tagging assistant for a travel blog, where articles are organized by city. Your task is to read the article text below and generate tags in two categories:

1. Primary Tags (3–5 tags):
Select from the allowed list below.
These tags will be used for filtering and navigation.
Strongly prefer these tags unless the content cannot be adequately captured by them.
Allowed primary tags:
["food", "nightlife", "transportation", "activities", "sightseeing", "nature", "shopping", "accommodation", "culture", "history", "tips"]

2. Secondary Tags (0–3 tags, optional):
Only include if additional nuance or detail significantly enhances content discoverability.
These tags can be any concise, single-word, relevant concept not in the allowed primary list.

✅ All tags (primary and secondary) must:

Be lowercase
Be single-word each (no hyphens or multi-word phrases)
Represent distinct, relevant concepts for city exploration

❌ Do NOT include (for any tags):

City, country, or region names (already categorized by city)
Dates, numbers, or years
Brand, business, or product names
Redundant or overlapping tags (e.g., "food" and "culinary")

Return only a valid JSON object matching this structure exactly, with no explanation, no code block, no markdown, and no surrounding text:

{ "primary_tags": ["tag1", "tag2", "tag3"], "secondary_tags": ["tag4", "tag5"] }

If no secondary tags are necessary, return an empty array:

{ "primary_tags": ["tag1", "tag2", "tag3"], "secondary_tags": [] }

    ${text.slice(0, 1500)}
    `;

  const response = await openai.chat.completions.create({
    model: "gpt-4",
    messages: [{ role: "user", content: prompt }],
    temperature: 0.5,
  });

  const raw = response.choices[0].message.content?.trim();
  const tags = JSON.parse(raw!);

  let primary: string[] = [];
  let secondary: string[] = [];

  if (
    tags &&
    typeof tags === 'object' &&
    !Array.isArray(tags) &&
    Array.isArray(tags.primary_tags) &&
    Array.isArray(tags.secondary_tags)
  ) {
    primary = tags.primary_tags
      .filter((t: unknown): t is string => typeof t === 'string')
      .map((t: string) => t.toLowerCase().trim());
  
    secondary = tags.secondary_tags
      .filter((t: unknown): t is string => typeof t === 'string')
      .map((t: string) => t.toLowerCase().trim());
  } else {
    console.warn('Invalid tags structure, falling back to empty arrays.');
  }
  
  return [primary, secondary];
}
