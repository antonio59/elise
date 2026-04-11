export interface GoogleBook {
  id: string;
  volumeInfo: {
    title: string;
    authors?: string[];
    publisher?: string;
    publishedDate?: string;
    description?: string;
    pageCount?: number;
    categories?: string[];
    imageLinks?: {
      smallThumbnail?: string;
      thumbnail?: string;
      small?: string;
      medium?: string;
      large?: string;
      extraLarge?: string;
    };
    industryIdentifiers?: Array<{
      type: string;
      identifier: string;
    }>;
    averageRating?: number;
    ratingsCount?: number;
  };
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
  rating?: number;
}

const BASE_URL = "https://www.googleapis.com/books/v1/volumes";

function getBestCoverUrl(
  imageLinks?: GoogleBook["volumeInfo"]["imageLinks"],
): string {
  if (!imageLinks) return "";

  const url =
    imageLinks.extraLarge ||
    imageLinks.large ||
    imageLinks.medium ||
    imageLinks.small ||
    imageLinks.thumbnail ||
    imageLinks.smallThumbnail ||
    "";

  return url.replace("http://", "https://").replace("&edge=curl", "");
}

export async function searchGoogleBooks(
  query: string,
  limit: number = 12,
): Promise<GoogleBook[]> {
  try {
    const response = await fetch(
      `${BASE_URL}?q=${encodeURIComponent(query)}&maxResults=${limit}&printType=books`,
    );

    if (!response.ok) {
      throw new Error("Failed to search Google Books");
    }

    const data = await response.json();
    return data.items || [];
  } catch (error) {
    console.error("Error searching Google Books:", error);
    return [];
  }
}

export async function searchGoogleBooksByISBN(
  isbn: string,
): Promise<GoogleBook | null> {
  try {
    const response = await fetch(
      `${BASE_URL}?q=isbn:${encodeURIComponent(isbn)}&maxResults=1`,
    );

    if (!response.ok) {
      throw new Error("Failed to search by ISBN");
    }

    const data = await response.json();
    return data.items?.[0] || null;
  } catch (error) {
    console.error("Error searching by ISBN:", error);
    return null;
  }
}

export function convertGoogleBookToDetails(book: GoogleBook): BookDetails {
  const { volumeInfo } = book;

  const isbn =
    volumeInfo.industryIdentifiers?.find((id) => id.type === "ISBN_13")
      ?.identifier ||
    volumeInfo.industryIdentifiers?.find((id) => id.type === "ISBN_10")
      ?.identifier;

  const publishYear = volumeInfo.publishedDate
    ? parseInt(volumeInfo.publishedDate.split("-")[0], 10)
    : undefined;

  return {
    title: volumeInfo.title,
    author: volumeInfo.authors?.join(", ") || "Unknown Author",
    coverUrl: getBestCoverUrl(volumeInfo.imageLinks),
    isbn,
    pageCount: volumeInfo.pageCount,
    publishYear,
    publisher: volumeInfo.publisher,
    description: volumeInfo.description,
    subjects: volumeInfo.categories,
    rating: volumeInfo.averageRating,
  };
}

export function determineAgeRating(categories?: string[]): string {
  if (!categories || categories.length === 0) return "8+";

  const categoriesLower = categories.map((c) => c.toLowerCase()).join(" ");

  if (
    categoriesLower.includes("young adult") ||
    categoriesLower.includes("teen")
  ) {
    return "12+";
  } else if (
    categoriesLower.includes("juvenile") ||
    categoriesLower.includes("children")
  ) {
    return "8+";
  } else if (
    categoriesLower.includes("picture book") ||
    categoriesLower.includes("early reader")
  ) {
    return "5+";
  }

  return "8+";
}

export function suggestGenre(categories?: string[]): string {
  if (!categories || categories.length === 0) return "Fiction";

  const categoriesLower = categories.map((c) => c.toLowerCase()).join(" ");

  if (categoriesLower.includes("fantasy")) {
    return "Fantasy";
  } else if (
    categoriesLower.includes("mystery") ||
    categoriesLower.includes("detective")
  ) {
    return "Mystery";
  } else if (
    categoriesLower.includes("science fiction") ||
    categoriesLower.includes("sci-fi")
  ) {
    return "Science Fiction";
  } else if (categoriesLower.includes("adventure")) {
    return "Adventure";
  } else if (categoriesLower.includes("historical")) {
    return "Historical Fiction";
  } else if (
    categoriesLower.includes("biography") ||
    categoriesLower.includes("autobiography")
  ) {
    return "Biography";
  } else if (
    categoriesLower.includes("poetry") ||
    categoriesLower.includes("poems")
  ) {
    return "Poetry";
  } else if (
    categoriesLower.includes("nonfiction") ||
    categoriesLower.includes("non-fiction")
  ) {
    return "Non-Fiction";
  }

  return "Fiction";
}
