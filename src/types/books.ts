export interface Book {
  _id: string;
  title: string;
  author: string;
  coverUrl?: string;
  coverImageUrl?: string | null;
  coverStorageId?: string;
  genre?: string;
  rating?: number;
  review?: string;
  isFavorite?: boolean;
  pageCount?: number;
  status: string;
  moodTags?: string[];
}
