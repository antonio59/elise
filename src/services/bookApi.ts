import {
  searchGoogleBooks,
  convertGoogleBookToDetails,
  suggestGenre as googleSuggestGenre,
  determineAgeRating as googleDetermineAgeRating,
  type GoogleBook,
  type BookDetails,
} from "./googleBooksApi";

import {
  searchBooks as searchOpenLibrary,
  convertToBookFormat as convertOpenLibraryBook,
  getCoverUrl,
  suggestGenre as openLibrarySuggestGenre,
  determineAgeRating as openLibraryDetermineAgeRating,
  type OpenLibraryBook,
} from "./openLibraryApi";

export type { BookDetails };

export interface UnifiedBook {
  id: string;
  source: "google" | "openlibrary";
  title: string;
  author: string;
  coverUrl: string;
  isbn?: string;
  pageCount?: number;
  publishYear?: number;
  publisher?: string;
  description?: string;
  subjects?: string[];
  _googleBook?: GoogleBook;
  _openLibraryBook?: OpenLibraryBook;
}

export async function searchBooks(
  query: string,
  limit: number = 12,
): Promise<UnifiedBook[]> {
  try {
    const googleResults = await searchGoogleBooks(query, limit);

    if (googleResults.length > 0) {
      return googleResults.map((book) => {
        const details = convertGoogleBookToDetails(book);
        return {
          id: book.id,
          source: "google" as const,
          title: details.title,
          author: details.author,
          coverUrl: details.coverUrl,
          isbn: details.isbn,
          pageCount: details.pageCount,
          publishYear: details.publishYear,
          publisher: details.publisher,
          description: details.description,
          subjects: details.subjects,
          _googleBook: book,
        };
      });
    }
  } catch (error) {
    console.warn("Google Books search failed, trying Open Library:", error);
  }

  try {
    const openLibraryResults = await searchOpenLibrary(query, limit);

    return openLibraryResults.map((book) => {
      const details = convertOpenLibraryBook(book);
      return {
        id: book.key,
        source: "openlibrary" as const,
        title: details.title,
        author: details.author,
        coverUrl: details.coverUrl,
        isbn: details.isbn,
        pageCount: details.pageCount,
        publishYear: details.publishYear,
        publisher: details.publisher,
        description: details.description,
        subjects: details.subjects,
        _openLibraryBook: book,
      };
    });
  } catch (error) {
    console.error("Both book APIs failed:", error);
    return [];
  }
}

export function suggestGenre(book: UnifiedBook): string {
  if (book.source === "google" && book._googleBook) {
    return googleSuggestGenre(book._googleBook.volumeInfo.categories);
  }
  if (book.source === "openlibrary" && book._openLibraryBook) {
    return openLibrarySuggestGenre(book._openLibraryBook.subject);
  }
  return "Fiction";
}

export function determineAgeRating(book: UnifiedBook): string {
  if (book.source === "google" && book._googleBook) {
    return googleDetermineAgeRating(book._googleBook.volumeInfo.categories);
  }
  if (book.source === "openlibrary" && book._openLibraryBook) {
    return openLibraryDetermineAgeRating(book._openLibraryBook.subject);
  }
  return "8+";
}

export async function getBookWithCover(
  book: UnifiedBook,
): Promise<BookDetails> {
  if (book.coverUrl && !book.coverUrl.includes("placeholder")) {
    return {
      title: book.title,
      author: book.author,
      coverUrl: book.coverUrl,
      isbn: book.isbn,
      pageCount: book.pageCount,
      publishYear: book.publishYear,
      publisher: book.publisher,
      description: book.description,
      subjects: book.subjects,
    };
  }

  if (book.source === "google" && book._openLibraryBook?.cover_i) {
    return {
      title: book.title,
      author: book.author,
      coverUrl: getCoverUrl(book._openLibraryBook.cover_i, "L"),
      isbn: book.isbn,
      pageCount: book.pageCount,
      publishYear: book.publishYear,
      publisher: book.publisher,
      description: book.description,
      subjects: book.subjects,
    };
  }

  return {
    title: book.title,
    author: book.author,
    coverUrl: book.coverUrl || "",
    isbn: book.isbn,
    pageCount: book.pageCount,
    publishYear: book.publishYear,
    publisher: book.publisher,
    description: book.description,
    subjects: book.subjects,
  };
}
