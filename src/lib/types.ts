export interface Book {
  id: string;
  title: string;
  author: string;
  description: string | null;
  genres: string[] | null;
  rating: number; // 1-5, 0 = not rated
  image_url: string | null;
  amazon_link: string | null;
  created_at: string;
}
