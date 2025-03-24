import type { NextApiRequest, NextApiResponse } from 'next';
import { fetchHTML } from '@/lib/fetchHTML';
import { parseContent } from '@/lib/parseContent';
import { generateTags } from '@/lib/generateTags';
import { generateEmbeddings } from '@/lib/generateEmbeddings';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const url = req.query.url as string;

  if (!url) return res.status(400).json({ error: 'Missing ?url=' });

  try {
    const html = await fetchHTML(url);
    const { title, text, image } = parseContent(html, url);
    const tags = await generateTags(`
        Article Title: ${title}

        Article Text: ${text}
        `
    )

    const embedding = await generateEmbeddings(
        `
        ${title}

        ${text}
        `
    )

    res.status(200).json({
      url,
      title,
      image,
      tags,
      embedding
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Something went wrong' });
  }
}
