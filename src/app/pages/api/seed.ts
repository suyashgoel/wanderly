import { createClient } from '@/utils/supabase/client';
import { NextApiRequest, NextApiResponse } from 'next';


interface ScrapeResponse {
   url: string
   title: string;
   image: string;
   tags: string[];
   embedding: number[];
 }


const articles = [
   { url: 'https://www.timeout.com/london/clubs/the-best-clubs-in-london', citySlug: 'london' },
   { url: 'https://www.bigbravenomad.com/blog/the-best-of-new-york-city-with-kids', citySlug: 'new-york' },
   { url: 'https://ny.eater.com/maps/best-new-york-restaurants-38-map', citySlug: 'new-york' },
   { url: 'https://cityroverwalks.com/how-to-use-nyc-subway-guide/', citySlug: 'new-york' },
   { url: 'https://www.neverendingfootsteps.com/mexico-city-itinerary/', citySlug: 'mexico-city' },
   { url: 'https://roadbook.com/mexico-city/city-guide/mexico-city-local-guide/', citySlug: 'mexico-city' },
   { url: 'https://www.theinfatuation.com/mexico-city/guides/best-bars-mexico-city', citySlug: 'mexico-city' },
   { url: 'https://newromantimes.substack.com/p/a-very-subjective-list-of-the-best-0d5', citySlug: 'rome' },
   { url: 'https://thetipsytours.com/blogs/news/rome-nightlife-the-ultimate-guide-for-2023/', citySlug: 'rome' },
   { url: 'https://jessicalynnwrites.com/2024/10/a-family-friendly-guide-to-a-weekend-in-rome-with-kids/', citySlug: 'rome' }
 ];
  export default async function handler(req: NextApiRequest, res: NextApiResponse) {

   const supabase = createClient();

   async function getProcessedArticleData(articleUrl: string): Promise<ScrapeResponse> {
     const response = await fetch(`http://localhost:3000/api/scrape?url=${encodeURIComponent(articleUrl)}`);
     if (!response.ok) {
       throw new Error(`Failed to fetch data from scrape endpoint for URL: ${articleUrl}`);
     }
     return response.json();
   }
    try {
     for (const article of articles) {
       const processedData = await getProcessedArticleData(article.url);
       console.log(processedData)
       const { data: city, error: cityError } = await supabase
         .from('cities')
         .select('id')
         .eq('slug', article.citySlug)
         .single();
        if (cityError) {
         throw new Error(`Failed to find city with slug: ${article.citySlug}`);
       }
        const { error: insertError } = await supabase.from('articles').insert({
         url: processedData.url,
         title: processedData.title,
         description: '',
         preview_image_url: processedData.image,
         tags: processedData.tags,
         embedding: processedData.embedding,
         city_id: city.id,
         user_id: '219bdad1-763e-4d11-a584-eafadefcb30d'  // replace with your actual user ID
       });
        if (insertError) {
         throw new Error(`Failed to insert article for URL: ${article.url}`);
       }
     }
      res.status(200).json({ message: 'Articles processed and added successfully!' });
   } catch (error) {
     console.error('Error processing and adding articles:', error);
     res.status(500).json({ error: 'Failed to process and add articles'});
   }
 }
