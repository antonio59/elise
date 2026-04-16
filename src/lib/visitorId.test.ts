import { describe, it, expect, beforeEach } from "vitest";
import { getVisitorId } from "./visitorId";

describe("getVisitorId", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("generates a new visitor ID when none exists", () => {
    const id = getVisitorId();
    expect(id).toMatch(/^visitor_\d+_[a-z0-9]+$/);
  });

  it("returns the same ID on subsequent calls", () => {
    const first = getVisitorId();
    const second = getVisitorId();
    expect(second).toBe(first);
  });
});
