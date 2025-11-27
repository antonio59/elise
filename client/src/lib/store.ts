import { create } from 'zustand';
import animeGirl from '@assets/generated_images/anime_style_girl_reading_magic_book.png';
import fantasyCover from '@assets/generated_images/fantasy_book_cover.png';
import scifiCover from '@assets/generated_images/sci-fi_book_cover.png';
import romanceCover from '@assets/generated_images/romance_book_cover.png';
import digitalArt from '@assets/generated_images/digital_art_example.png';

export interface Book {
  id: string;
  title: string;
  author: string;
  rating: number;
  review: string;
  cover: string;
  dateRead: string;
}

export interface ArtWork {
  id: string;
  title: string;
  description: string;
  image: string;
  dateCreated: string;
}

interface Store {
  books: Book[];
  artworks: ArtWork[];
  addBook: (book: Omit<Book, 'id'>) => void;
  removeBook: (id: string) => void;
  addArt: (art: Omit<ArtWork, 'id'>) => void;
  removeArt: (id: string) => void;
}

export const useStore = create<Store>((set) => ({
  books: [
    {
      id: '1',
      title: 'The Magic Forest',
      author: 'Elena Myst',
      rating: 5,
      review: 'This book was absolutely magical! I loved the characters and the world building. The ending made me cry happy tears.',
      cover: fantasyCover,
      dateRead: '2024-10-15',
    },
    {
      id: '2',
      title: 'Robot Dreams',
      author: 'Isaac Spark',
      rating: 4,
      review: 'Really cool sci-fi story about a robot who wants to paint. A bit slow in the middle but great ending.',
      cover: scifiCover,
      dateRead: '2024-11-02',
    },
    {
      id: '3',
      title: 'School Days',
      author: 'Sakura T.',
      rating: 5,
      review: 'The cutest romance ever! I wish my school life was this exciting. 10/10 recommend.',
      cover: romanceCover,
      dateRead: '2024-11-20',
    },
  ],
  artworks: [
    {
      id: '1',
      title: 'Cat Wizard',
      description: 'My first digital painting using the new tablet!',
      image: digitalArt,
      dateCreated: '2024-11-05',
    }
  ],
  addBook: (book) => set((state) => ({
    books: [...state.books, { ...book, id: Math.random().toString(36).substr(2, 9) }]
  })),
  removeBook: (id) => set((state) => ({
    books: state.books.filter((b) => b.id !== id)
  })),
  addArt: (art) => set((state) => ({
    artworks: [...state.artworks, { ...art, id: Math.random().toString(36).substr(2, 9) }]
  })),
  removeArt: (id) => set((state) => ({
    artworks: state.artworks.filter((a) => a.id !== id)
  })),
}));
