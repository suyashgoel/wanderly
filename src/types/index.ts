export interface Article {
    id: string;
    url: string;
    title: string;
    image_url: string;
    description: string;
    tags: string[];
    embedding: number[];
    city_id: string;
    user_id: string;
    createdAt: string;
  }