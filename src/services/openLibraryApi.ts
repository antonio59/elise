export interface OpenLibraryBook {
  key: string;
  title: string;
  author_name?: string[];
  first_publish_year?: number;
  isbn?: string[];
  cover_i?: number;
  edition_count?: number;
  publisher?: string[];
  language?: string[];
  subject?: string[];
  number_of_pages_median?: number;
}

export interface BookDetails {
  title: string;
  author: string;
  coverUrl: string;
  isbn?: string;
  pageCount?: number;
  publishYear?: number;
  publisher?: string;
  description?: string;
  subjects?: string[];
}

const BASE_URL = "https://openlibrary.org";
const COVER_URL = "https://covers.openlibrary.org/b";

export async function searchBooks(
  query: string,
  limit: number = 10,
): Promise<OpenLibraryBook[]> {
  try {
    const response = await fetch(
      `${BASE_URL}/search.json?q=${encodeURIComponent(query)}&limit=${limit}`,
    );

    if (!response.ok) {
      throw new Error("Failed to search books");
    }

    const data = await response.json();
    return data.docs || [];
  } catch (error) {
    console.error("Error searching books:", error);
    return [];
  }
}

export async function searchByISBN(isbn: string): Promise<OpenLibraryBook[]> {
  try {
    const response = await fetch(
      `${BASE_URL}/search.json?isbn=${encodeURIComponent(isbn)}`,
    );

    if (!response.ok) {
      throw new Error("Failed to search by ISBN");
    }

    const data = await response.json();
    return data.docs || [];
  } catch (error) {
    console.error("Error searching by ISBN:", error);
    return [];
  }
}

export function getCoverUrl(
  coverId: number,
  size: "S" | "M" | "L" = "M",
): string {
  return `${COVER_URL}/id/${coverId}-${size}.jpg`;
}

export function getCoverByISBN(
  isbn: string,
  size: "S" | "M" | "L" = "M",
): string {
  return `${COVER_URL}/isbn/${isbn}-${size}.jpg`;
}

export function convertToBookFormat(book: OpenLibraryBook): BookDetails {
  const coverUrl = book.cover_i ? getCoverUrl(book.cover_i, "M") : "";

  return {
    title: book.title,
    author: book.author_name?.[0] || "Unknown Author",
    coverUrl,
    isbn: book.isbn?.[0],
    pageCount: book.number_of_pages_median,
    publishYear: book.first_publish_year,
    publisher: book.publisher?.[0],
    subjects: book.subject?.slice(0, 5),
  };
}

export function determineAgeRating(subjects?: string[]): string {
  if (!subjects || subjects.length === 0) return "8+";

  const subjectsLower = subjects.map((s) => s.toLowerCase()).join(" ");

  if (subjectsLower.includes("young adult") || subjectsLower.includes("teen")) {
    return "12+";
  } else if (
    subjectsLower.includes("middle grade") ||
    subjectsLower.includes("children")
  ) {
    return "8+";
  } else if (
    subjectsLower.includes("picture book") ||
    subjectsLower.includes("early reader")
  ) {
    return "5+";
  }

  return "8+";
}

export function suggestGenre(subjects?: string[]): string {
  if (!subjects || subjects.length === 0) return "Fiction";

  const subjectsLower = subjects.map((s) => s.toLowerCase()).join(" ");

  if (subjectsLower.includes("fantasy") || subjectsLower.includes("magic")) {
    return "Fantasy";
  } else if (
    subjectsLower.includes("mystery") ||
    subjectsLower.includes("detective")
  ) {
    return "Mystery";
  } else if (
    subjectsLower.includes("science fiction") ||
    subjectsLower.includes("sci-fi")
  ) {
    return "Science Fiction";
  } else if (subjectsLower.includes("adventure")) {
    return "Adventure";
  } else if (subjectsLower.includes("historical")) {
    return "Historical Fiction";
  } else if (
    subjectsLower.includes("biography") ||
    subjectsLower.includes("autobiography")
  ) {
    return "Biography";
  } else if (
    subjectsLower.includes("poetry") ||
    subjectsLower.includes("poems")
  ) {
    return "Poetry";
  }

  return "Fiction";
}
