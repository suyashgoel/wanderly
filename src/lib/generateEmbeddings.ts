import { openai } from "@/lib/openai";

export async function generateEmbeddings(text: string): Promise<number[]> {
    const response = await openai.embeddings.create({
      model: "text-embedding-3-small",
      input: text.slice(0, 1500),
      encoding_format: "float",
    });
    
    return response.data[0].embedding;
}
