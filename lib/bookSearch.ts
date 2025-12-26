// Unified book search that uses Google Books and Open Library

export type BookResult = {
  id: string;
  title: string;
  authors: string[];
  description?: string;
  coverUrl?: string;
  coverUrlLarge?: string;
  pageCount?: number;
  publishedDate?: string;
  categories?: string[];
  isbn?: string;
  publisher?: string;
  source: "google" | "openlibrary";
};

// Google Books API
async function searchGoogleBooks(query: string): Promise<BookResult[]> {
  try {
    const response = await fetch(
      `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(query)}&maxResults=10&printType=books`,
    );
    const data = await response.json();

    if (!data.items) return [];

    return data.items.map((item: any) => {
      const info = item.volumeInfo;
      const imageLinks = info.imageLinks || {};

      return {
        id: `google-${item.id}`,
        title: info.title || "Unknown Title",
        authors: info.authors || ["Unknown Author"],
        description: info.description,
        coverUrl: imageLinks.thumbnail?.replace("http:", "https:"),
        coverUrlLarge: (
          imageLinks.large ||
          imageLinks.medium ||
          imageLinks.thumbnail
        )?.replace("http:", "https:"),
        pageCount: info.pageCount,
        publishedDate: info.publishedDate,
        categories: info.categories,
        isbn:
          info.industryIdentifiers?.find((id: any) => id.type === "ISBN_13")
            ?.identifier ||
          info.industryIdentifiers?.find((id: any) => id.type === "ISBN_10")
            ?.identifier,
        publisher: info.publisher,
        source: "google" as const,
      };
    });
  } catch (error) {
    console.error("Google Books search failed:", error);
    return [];
  }
}

// Open Library API
async function searchOpenLibrary(query: string): Promise<BookResult[]> {
  try {
    const response = await fetch(
      `https://openlibrary.org/search.json?q=${encodeURIComponent(query)}&limit=10`,
    );
    const data = await response.json();

    if (!data.docs) return [];

    return data.docs.map((doc: any) => {
      const coverId = doc.cover_i;
      return {
        id: `ol-${doc.key}`,
        title: doc.title || "Unknown Title",
        authors: doc.author_name || ["Unknown Author"],
        description: doc.first_sentence?.join(" "),
        coverUrl: coverId
          ? `https://covers.openlibrary.org/b/id/${coverId}-M.jpg`
          : undefined,
        coverUrlLarge: coverId
          ? `https://covers.openlibrary.org/b/id/${coverId}-L.jpg`
          : undefined,
        pageCount: doc.number_of_pages_median,
        publishedDate: doc.first_publish_year?.toString(),
        categories: doc.subject?.slice(0, 3),
        isbn: doc.isbn?.[0],
        publisher: doc.publisher?.[0],
        source: "openlibrary" as const,
      };
    });
  } catch (error) {
    console.error("Open Library search failed:", error);
    return [];
  }
}

// Search by ISBN specifically
export async function searchByISBN(isbn: string): Promise<BookResult | null> {
  // Clean ISBN
  const cleanISBN = isbn.replace(/[-\s]/g, "");

  // Try Google Books first
  try {
    const response = await fetch(
      `https://www.googleapis.com/books/v1/volumes?q=isbn:${cleanISBN}`,
    );
    const data = await response.json();

    if (data.items?.[0]) {
      const item = data.items[0];
      const info = item.volumeInfo;
      const imageLinks = info.imageLinks || {};

      return {
        id: `google-${item.id}`,
        title: info.title,
        authors: info.authors || ["Unknown Author"],
        description: info.description,
        coverUrl: imageLinks.thumbnail?.replace("http:", "https:"),
        coverUrlLarge: (
          imageLinks.large ||
          imageLinks.medium ||
          imageLinks.thumbnail
        )?.replace("http:", "https:"),
        pageCount: info.pageCount,
        publishedDate: info.publishedDate,
        categories: info.categories,
        isbn: cleanISBN,
        publisher: info.publisher,
        source: "google",
      };
    }
  } catch (error) {
    console.error("Google ISBN search failed:", error);
  }

  // Fallback to Open Library
  try {
    const response = await fetch(
      `https://openlibrary.org/api/books?bibkeys=ISBN:${cleanISBN}&format=json&jscmd=data`,
    );
    const data = await response.json();
    const book = data[`ISBN:${cleanISBN}`];

    if (book) {
      return {
        id: `ol-${cleanISBN}`,
        title: book.title,
        authors: book.authors?.map((a: any) => a.name) || ["Unknown Author"],
        description: book.notes,
        coverUrl: book.cover?.medium,
        coverUrlLarge: book.cover?.large,
        pageCount: book.number_of_pages,
        publishedDate: book.publish_date,
        categories: book.subjects?.slice(0, 3).map((s: any) => s.name),
        isbn: cleanISBN,
        publisher: book.publishers?.[0]?.name,
        source: "openlibrary",
      };
    }
  } catch (error) {
    console.error("Open Library ISBN search failed:", error);
  }

  return null;
}

// Combined search - tries Google first, falls back to Open Library
export async function searchBooks(query: string): Promise<BookResult[]> {
  if (!query || query.length < 2) return [];

  // Check if it looks like an ISBN
  const cleanQuery = query.replace(/[-\s]/g, "");
  if (/^\d{10,13}$/.test(cleanQuery)) {
    const result = await searchByISBN(cleanQuery);
    return result ? [result] : [];
  }

  // Try Google Books first
  let results = await searchGoogleBooks(query);

  // If Google returns few results, supplement with Open Library
  if (results.length < 5) {
    const olResults = await searchOpenLibrary(query);
    // Deduplicate by title (rough)
    const existingTitles = new Set(results.map((r) => r.title.toLowerCase()));
    const newResults = olResults.filter(
      (r) => !existingTitles.has(r.title.toLowerCase()),
    );
    results = [...results, ...newResults].slice(0, 10);
  }

  return results;
}

// Get popular/trending books for suggestions
export async function getPopularBooks(
  category?: string,
): Promise<BookResult[]> {
  const categories = [
    "young adult fantasy",
    "manga",
    "graphic novels",
    "teen fiction",
    "adventure",
  ];
  const searchCategory =
    category || categories[Math.floor(Math.random() * categories.length)];

  try {
    const response = await fetch(
      `https://www.googleapis.com/books/v1/volumes?q=subject:${encodeURIComponent(searchCategory)}&orderBy=relevance&maxResults=12&printType=books`,
    );
    const data = await response.json();

    if (!data.items) return [];

    return data.items.map((item: any) => {
      const info = item.volumeInfo;
      const imageLinks = info.imageLinks || {};

      return {
        id: `google-${item.id}`,
        title: info.title || "Unknown Title",
        authors: info.authors || ["Unknown Author"],
        description: info.description,
        coverUrl: imageLinks.thumbnail?.replace("http:", "https:"),
        coverUrlLarge: (
          imageLinks.large ||
          imageLinks.medium ||
          imageLinks.thumbnail
        )?.replace("http:", "https:"),
        pageCount: info.pageCount,
        publishedDate: info.publishedDate,
        categories: info.categories,
        isbn: info.industryIdentifiers?.find((id: any) => id.type === "ISBN_13")
          ?.identifier,
        publisher: info.publisher,
        source: "google" as const,
      };
    });
  } catch (error) {
    console.error("Failed to fetch popular books:", error);
    return [];
  }
}
