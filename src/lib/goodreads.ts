/**
 * Goodreads "Export My Library" CSV importer.
 * Goodreads retired their public API, so the CSV export
 * (goodreads.com → My Books → Import/Export → Export Library) is the
 * supported way to move a library.
 */

export interface GoodreadsImportRow {
  title: string;
  author: string;
  status: "read" | "reading" | "wishlist";
  isbn?: string;
  series?: string;
  rating?: number;
  review?: string;
  pageCount?: number;
  finishedAt?: number;
  createdAt?: number;
}

export interface GoodreadsParseResult {
  rows: GoodreadsImportRow[];
  skipped: number;
  total: number;
}

/** Minimal RFC 4180 CSV parser: quoted fields, "" escapes, embedded newlines. */
export function parseCsv(text: string): string[][] {
  const rows: string[][] = [];
  let field = "";
  let row: string[] = [];
  let inQuotes = false;
  let i = 0;

  // Strip BOM
  if (text.charCodeAt(0) === 0xfeff) text = text.slice(1);

  while (i < text.length) {
    const ch = text[i];
    if (inQuotes) {
      if (ch === '"') {
        if (text[i + 1] === '"') {
          field += '"';
          i++;
        } else {
          inQuotes = false;
        }
      } else {
        field += ch;
      }
    } else if (ch === '"') {
      inQuotes = true;
    } else if (ch === ",") {
      row.push(field);
      field = "";
    } else if (ch === "\n") {
      row.push(field);
      rows.push(row);
      field = "";
      row = [];
    } else if (ch === "\r") {
      // skip - handled by \n
    } else {
      field += ch;
    }
    i++;
  }
  if (field.length > 0 || row.length > 0) {
    row.push(field);
    rows.push(row);
  }
  return rows;
}

/** Goodreads wraps ISBNs as Excel formulas: ="9780439023481". The CSV
 *  quotes get consumed during parsing, so strip = and " anywhere. */
function cleanIsbn(value: string | undefined): string | undefined {
  const v = (value ?? "").replace(/[="]/g, "").trim();
  return v || undefined;
}

function parseGoodreadsDate(value: string | undefined): number | undefined {
  const v = (value ?? "").trim();
  if (!v) return undefined;
  // Goodreads uses YYYY/MM/DD
  const m = v.match(/^(\d{4})\/(\d{1,2})\/(\d{1,2})$/);
  if (!m) return undefined;
  const t = Date.UTC(+m[1], +m[2] - 1, +m[3]);
  return Number.isNaN(t) ? undefined : t;
}

/** Reviews can carry light HTML (<br/>, <i>) - flatten to plain text.
 *  Tags are stripped to a fixpoint so nested fragments like <<script>>
 *  can't survive, and &amp; is decoded last to avoid double-unescaping. */
function cleanReview(value: string | undefined): string | undefined {
  let v = (value ?? "").replace(/<br\s*\/?>/gi, "\n");
  let prev: string;
  do {
    prev = v;
    v = v.replace(/<[^>]*>/g, "");
  } while (v !== prev);
  v = v
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&amp;/g, "&")
    .trim();
  return v || undefined;
}

/** "The Hunger Games (The Hunger Games, #1)" → series + clean title. */
function splitSeries(title: string): { title: string; series?: string } {
  const m = title.match(/^(.*?)\s*\(([^()]+?),\s*#([\d.]+)\)\s*$/);
  if (!m) return { title: title.trim() };
  return {
    title: m[1].trim(),
    series: `${m[2].trim()} #${m[3]}`,
  };
}

function mapShelf(shelf: string | undefined): GoodreadsImportRow["status"] {
  switch ((shelf ?? "").trim()) {
    case "currently-reading":
      return "reading";
    case "to-read":
      return "wishlist";
    default:
      return "read";
  }
}

export function parseGoodreadsCsv(text: string): GoodreadsParseResult {
  const table = parseCsv(text);
  if (table.length < 2) return { rows: [], skipped: 0, total: 0 };

  const header = table[0].map((h) => h.trim().toLowerCase());
  const col = (name: string) => header.indexOf(name.toLowerCase());
  const get = (cells: string[], name: string) => {
    const idx = col(name);
    return idx === -1 ? undefined : cells[idx];
  };

  // Require the columns that make a row meaningful
  if (col("title") === -1 || col("author") === -1) {
    throw new Error(
      "This doesn't look like a Goodreads export - no Title/Author columns found.",
    );
  }

  const rows: GoodreadsImportRow[] = [];
  let skipped = 0;

  for (const cells of table.slice(1)) {
    const rawTitle = (get(cells, "title") ?? "").trim();
    const author = (get(cells, "author") ?? "").trim();
    if (!rawTitle || !author) {
      skipped++;
      continue;
    }

    const { title, series } = splitSeries(rawTitle);
    const rating = parseInt(get(cells, "my rating") ?? "", 10);
    const pages = parseInt(get(cells, "number of pages") ?? "", 10);
    const status = mapShelf(get(cells, "exclusive shelf"));
    const dateRead = parseGoodreadsDate(get(cells, "date read"));
    const dateAdded = parseGoodreadsDate(get(cells, "date added"));

    rows.push({
      title,
      author,
      status,
      isbn: cleanIsbn(get(cells, "isbn13")) ?? cleanIsbn(get(cells, "isbn")),
      series,
      rating:
        Number.isFinite(rating) && rating >= 1 && rating <= 5
          ? rating
          : undefined,
      review: cleanReview(get(cells, "my review")),
      pageCount: Number.isFinite(pages) && pages > 0 ? pages : undefined,
      finishedAt: status === "read" ? dateRead : undefined,
      createdAt: dateAdded,
    });
  }

  return { rows, skipped, total: table.length - 1 };
}
