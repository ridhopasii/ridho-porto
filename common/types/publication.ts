export interface PublicationItem {
  id: number;
  title: string;
  outlet: string;
  date: string;
  url?: string | null;
  description?: string | null;
  tags?: string | null;
  createdAt: string;
  updatedAt: string;
  imageUrl?: string | null;
  images?: unknown;
  slug?: string | null;
  showOnHome?: boolean | null;
}
