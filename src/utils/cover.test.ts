import { describe, it, expect, vi } from "vitest";
import { getCoverUrl, CONVEX_DEPLOYMENT } from "./cover";

describe("getCoverUrl", () => {
  it("returns storage URL when coverStorageId is present", () => {
    const result = getCoverUrl({
      coverStorageId: "abc123",
      coverUrl: "https://example.com/cover.jpg",
    });
    expect(result).toBe(`https://${CONVEX_DEPLOYMENT}/api/storage/abc123`);
  });

  it("returns coverUrl with ampersands decoded when no storage id", () => {
    const result = getCoverUrl({
      coverUrl: "https://books.google.com/books?id=123&amp;zoom=3",
    });
    expect(result).toBe("https://books.google.com/books?id=123&zoom=3");
  });

  it("returns undefined when no cover sources exist", () => {
    const result = getCoverUrl({});
    expect(result).toBeUndefined();
  });
});
