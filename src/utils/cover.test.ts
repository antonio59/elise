import { describe, it, expect } from "vitest";
import { getCoverUrl } from "./cover";

describe("getCoverUrl", () => {
  it("returns storage URL when coverStorageId is present", () => {
    const url = getCoverUrl({ coverStorageId: "abc123" });
    expect(url).toContain("abc123");
    expect(url).toMatch(/^https:\/\//);
  });

  it("returns coverUrl when no storageId", () => {
    const url = getCoverUrl({ coverUrl: "https://example.com/cover.jpg" });
    expect(url).toBe("https://example.com/cover.jpg");
  });

  it("decodes &amp; entities in coverUrl", () => {
    const url = getCoverUrl({ coverUrl: "https://books.google.com/img?id=1&amp;zoom=1" });
    expect(url).toBe("https://books.google.com/img?id=1&zoom=1");
  });

  it("prefers storageId over coverUrl", () => {
    const url = getCoverUrl({
      coverStorageId: "stored123",
      coverUrl: "https://example.com/fallback.jpg",
    });
    expect(url).toContain("stored123");
    expect(url).not.toContain("fallback");
  });

  it("returns undefined when both are absent", () => {
    expect(getCoverUrl({})).toBeUndefined();
  });
});
