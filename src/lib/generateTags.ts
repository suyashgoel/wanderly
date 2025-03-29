import { openai } from "@/lib/openai";

export type TaggingResult = {
  success: boolean;
  primary_tags: string[];
  secondary_tags: string[];
  error?: string; // Describes failure reason
};

export async function generateTags(text: string): Promise<TaggingResult> {
  // Ensure text is non-empty
  if (!text.trim()) {
    return {
      success: false,
      primary_tags: [],
      secondary_tags: [],
      error: "Input text is empty",
    };
  }

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
- Be lowercase
- Be single-word each (no hyphens or multi-word phrases)
- Represent distinct, relevant concepts for city exploration

❌ Do NOT include (for any tags):
- City, country, or region names (already categorized by city)
- Dates, numbers, or years
- Brand, business, or product names
- Redundant or overlapping tags (e.g., "food" and "culinary")

Return only a valid JSON object matching this structure exactly, with no explanation, no code block, no markdown, and no surrounding text:

{ "primary_tags": ["tag1", "tag2", "tag3"], "secondary_tags": ["tag4", "tag5"] }

If no secondary tags are necessary, return an empty array:

{ "primary_tags": ["tag1", "tag2", "tag3"], "secondary_tags": [] }

${text.slice(0, 1500)}
`;

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.5,
    });

    const raw = response.choices[0].message.content?.trim();

    // Validate JSON response
    if (!raw) {
      return {
        success: false,
        primary_tags: [],
        secondary_tags: [],
        error: "Empty response from OpenAI",
      };
    }

    let tags;
    try {
      tags = JSON.parse(raw);
    } catch (jsonError) {
      return {
        success: false,
        primary_tags: [],
        secondary_tags: [],
        error: "Invalid JSON format returned",
      };
    }

    // Ensure the parsed JSON follows the expected structure
    if (
      !tags ||
      typeof tags !== "object" ||
      !Array.isArray(tags.primary_tags) ||
      !Array.isArray(tags.secondary_tags)
    ) {
      return {
        success: false,
        primary_tags: [],
        secondary_tags: [],
        error: "Unexpected tags structure returned",
      };
    }

    return {
      success: true,
      primary_tags: tags.primary_tags
        .filter((t: unknown): t is string => typeof t === "string")
        .map((t: string) => t.toLowerCase().trim()),
      secondary_tags: tags.secondary_tags
        .filter((t: unknown): t is string => typeof t === "string")
        .map((t: string) => t.toLowerCase().trim()),
    };
  } catch (error: any) {
    console.error("Error generating tags:", error.message);

    return {
      success: false,
      primary_tags: [],
      secondary_tags: [],
      error: `OpenAI API error: ${error.message}`,
    };
  }
}
