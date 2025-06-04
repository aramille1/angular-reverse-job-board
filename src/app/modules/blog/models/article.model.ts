export interface Article {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  author: string;
  date: Date;
  imageUrl?: string;
  metaDescription?: string;
  keywords?: string;
}
