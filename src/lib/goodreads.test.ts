import { describe, it, expect } from "vitest";
import { parseCsv, parseGoodreadsCsv } from "./goodreads";

const HEADER =
  "Book Id,Title,Author,Author l-f,Additional Authors,ISBN,ISBN13,My Rating,Average Rating,Publisher,Binding,Number of Pages,Year Published,Original Publication Year,Date Read,Date Added,Bookshelves,Bookshelves with positions,Exclusive Shelf,My Review,Spoiler,Private Notes,Read Count,Owned Copies";

describe("parseCsv", () => {
  it("parses simple rows", () => {
    expect(parseCsv("a,b,c\n1,2,3")).toEqual([
      ["a", "b", "c"],
      ["1", "2", "3"],
    ]);
  });

  it("handles quoted fields with commas and newlines", () => {
    expect(parseCsv('a,b\n"one, two","line1\nline2"')).toEqual([
      ["a", "b"],
      ["one, two", "line1\nline2"],
    ]);
  });

  it("handles escaped quotes", () => {
    expect(parseCsv('a\n"say ""hi""!"')).toEqual([["a"], ['say "hi"!']]);
  });

  it("strips BOM and CRLF", () => {
    expect(parseCsv("﻿a,b\r\n1,2\r\n")).toEqual([
      ["a", "b"],
      ["1", "2"],
    ]);
  });
});

describe("parseGoodreadsCsv", () => {
  it("maps a read book with rating, review, isbn, dates", () => {
    const csv = `${HEADER}
123,"The Hunger Games (The Hunger Games, #1)",Suzanne Collins,"Collins, Suzanne",,="0439023483",="9780439023481",5,4.32,Scholastic,Hardcover,374,2008,2008,2020/05/14,2019/01/02,,,read,"<i>Loved</i><br/>it",,,1,0`;
    const { rows, skipped, total } = parseGoodreadsCsv(csv);
    expect(total).toBe(1);
    expect(skipped).toBe(0);
    expect(rows[0]).toMatchObject({
      title: "The Hunger Games",
      author: "Suzanne Collins",
      status: "read",
      isbn: "9780439023481",
      series: "The Hunger Games #1",
      rating: 5,
      review: "Loved\nit",
      pageCount: 374,
    });
    expect(rows[0].finishedAt).toBe(Date.UTC(2020, 4, 14));
    expect(rows[0].createdAt).toBe(Date.UTC(2019, 0, 2));
  });

  it("maps shelves to statuses", () => {
    const csv = `${HEADER}
1,A Book,A Author,,,,,,3.9,,0,,,,,,,,currently-reading,,,,0,0
2,B Book,B Author,,,,,,4.1,,0,,,,,,,,to-read,,,,0,0
3,C Book,C Author,,,,,,4.5,,0,,,,,,,,read,,,,0,0`;
    const { rows } = parseGoodreadsCsv(csv);
    expect(rows.map((r) => r.status)).toEqual([
      "reading",
      "wishlist",
      "read",
    ]);
  });

  it("skips rows missing title or author", () => {
    const csv = `${HEADER}
1,,No Author,,,,,,3.9,,0,,,,,,,read,,,,0,0
2,No Title,,,,,,,3.9,,0,,,,,,,read,,,,0,0`;
    const { rows, skipped } = parseGoodreadsCsv(csv);
    expect(rows).toHaveLength(0);
    expect(skipped).toBe(2);
  });

  it("throws on non-Goodreads CSV", () => {
    expect(() => parseGoodreadsCsv("foo,bar\n1,2")).toThrow(
      /Goodreads export/,
    );
  });

  it("strips nested tag fragments and unescapes entities once", () => {
    const csv = `${HEADER}
1,A Book,A Author,,,,,,0,4.0,,0,,,,,,,read,"<<script>alert</script> fish &amp;lt;tag&amp;gt;",,,0,0`;
    const { rows } = parseGoodreadsCsv(csv);
    expect(rows[0].review).toBe("alert fish &lt;tag&gt;");
  });

  it("omits zero ratings and zero page counts", () => {
    const csv = `${HEADER}
1,A Book,A Author,,,,,,0,4.0,,0,,,,,,,read,,,,0,0`;
    const { rows } = parseGoodreadsCsv(csv);
    expect(rows[0].rating).toBeUndefined();
    expect(rows[0].pageCount).toBeUndefined();
  });
});
