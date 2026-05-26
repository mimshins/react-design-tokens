import { isPlainObject } from "./is-plain-object.ts";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyObject = Record<keyof any, any>;

type Merged<T, S> = { [K in keyof S]: S[K] } & {
  [K in keyof T]: K extends keyof S ? S[K] : T[K];
};

/**
 * Shallow-merges `source` into `target` (`{ ...target, ...source }`).
 * Source keys take precedence over target keys.
 * Throws if either argument is not a plain object.
 */
export const shallowMerge = <T extends AnyObject, S extends AnyObject>(
  target: T,
  source: S,
): Merged<T, S> => {
  if (!isPlainObject(target) || !isPlainObject(source)) {
    throw new Error(
      "[ReactDesignTokens] Invalid inputs. Provide valid plain objects as inputs.",
    );
  }

  return { ...target, ...source };
};
