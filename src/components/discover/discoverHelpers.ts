const CATEGORY_MAP: Record<string, string> = {
  fantasy: "Fantasy",
  "science fiction": "Sci-Fi",
  "sci-fi": "Sci-Fi",
  romance: "Romance",
  mystery: "Mystery",
  horror: "Horror",
  action: "Action",
  adventure: "Action",
  comedy: "Comedy",
  humor: "Comedy",
  drama: "Drama",
  "slice of life": "Slice of Life",
  manga: "Manga",
  manhwa: "Manhwa",
  webtoon: "Webtoon",
  "light novel": "Light Novel",
  "graphic novel": "Manga",
  thriller: "Mystery",
  suspense: "Mystery",
  "young adult": "Drama",
  contemporary: "Slice of Life",
  historical: "Drama",
  "dark fantasy": "Fantasy",
  "urban fantasy": "Fantasy",
  "paranormal romance": "Romance",
};

export function mapCategoryToGenre(categories: string[]): string {
  for (const cat of categories) {
    const lower = cat.toLowerCase().trim();
    if (CATEGORY_MAP[lower]) return CATEGORY_MAP[lower];
    for (const [key, genre] of Object.entries(CATEGORY_MAP)) {
      if (lower.includes(key)) return genre;
    }
  }
  return "Other";
}

export interface BookCandidate {
  googleBookId: string;
  title: string;
  author: string;
  coverUrl?: string;
  genre?: string;
  pageCount?: number;
  description?: string;
}

export function buildSearchQueries(
  topGenres: string[],
  topMoods: string[],
  topAuthors: string[],
  highlyRated: string[]
): string[] {
  const queries: string[] = [];

  for (const genre of topGenres.slice(0, 3)) {
    queries.push(`subject:${genre.toLowerCase()} fiction`);
  }

  const moodSearchMap: Record<string, string> = {
    "dark academia": "dark academia fiction",
    cottagecore: "cozy cottage fiction",
    "found family": "found family fiction",
    "slow burn": "slow burn romance",
    sapphic: "sapphic fiction",
    "enemies-to-lovers": "enemies to lovers romance",
    "fantasy romance": "fantasy romance",
    paranormal: "paranormal fiction",
    "time travel": "time travel fiction",
    ghosts: "ghost story fiction",
  };

  for (const mood of topMoods.slice(0, 2)) {
    const search = moodSearchMap[mood] ?? `${mood} fiction`;
    queries.push(search);
  }

  for (const title of highlyRated.slice(0, 2)) {
    queries.push(`"similar to" "${title}"`);
  }

  for (const author of topAuthors.slice(0, 1)) {
    queries.push(`inauthor:"${author}"`);
  }

  queries.push("best fiction books 2025");
  queries.push("award winning novels");

  return queries;
}
