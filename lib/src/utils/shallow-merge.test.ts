import { describe, expect, it } from "vitest";
import { shallowMerge } from "./shallow-merge.ts";

describe("shallowMerge", () => {
  it("merges two objects with source taking precedence", () => {
    const result = shallowMerge({ a: 1, b: 2 }, { b: 99, c: 3 });

    expect(result).toEqual({ a: 1, b: 99, c: 3 });
  });

  it("does not mutate inputs", () => {
    const target = { a: 1 };
    const source = { b: 2 };

    shallowMerge(target, source);
    expect(target).toEqual({ a: 1 });
    expect(source).toEqual({ b: 2 });
  });

  it("throws when target is not a plain object", () => {
    expect(() => shallowMerge([] as never, {})).toThrow();
  });

  it("throws when source is not a plain object", () => {
    expect(() => shallowMerge({}, [] as never)).toThrow();
  });
});
