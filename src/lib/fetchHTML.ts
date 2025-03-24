import got from 'got';

export async function fetchHTML(url: string): Promise<string> {
  const response = await got(url);
  return response.body;
}
