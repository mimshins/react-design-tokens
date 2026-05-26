import { describe, expect, it } from "vitest";
import { isPlainObject } from "./is-plain-object.ts";

describe("isPlainObject", () => {
  it("returns true for plain objects", () => {
    expect(isPlainObject({})).toBe(true);
    expect(isPlainObject({ a: 1 })).toBe(true);
  });

  it("returns false for non-objects", () => {
    expect(isPlainObject(null)).toBeFalsy();
    expect(isPlainObject(undefined)).toBeFalsy();
    expect(isPlainObject(42)).toBeFalsy();
    expect(isPlainObject("string")).toBeFalsy();
    expect(isPlainObject([])).toBeFalsy();
  });

  it("returns false for class instances", () => {
    expect(isPlainObject(new Date())).toBe(false);
    expect(isPlainObject(new Map())).toBe(false);
  });
});
