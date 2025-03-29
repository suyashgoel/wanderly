import { openai } from "@/lib/openai";

export async function generateEmbeddings(text: string): Promise<number[]> {
  try {
    const response = await openai.embeddings.create({
      model: "text-embedding-3-small",
      input: text,
      encoding_format: "float",
    });
    return response.data[0].embedding;
  } 
  catch (error: any){
    console.error('Failed to generate embeddings', error.message);
    throw new Error(`Error generating embeddings: ${error.message}`);
  }
}
