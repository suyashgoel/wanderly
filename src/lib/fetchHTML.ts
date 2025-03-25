import got from 'got';

export async function fetchHTML(url: string): Promise<string> {
  try {
    const response = await got(url, {
      timeout: {
        request: 10000
      },
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3'
      }
    });
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.statusCode}`);
    }
    return response.body;
  } catch (error) {
    console.error(`Failed to fetch HTML from ${url}`);
    throw error;
  }
}