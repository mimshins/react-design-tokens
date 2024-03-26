import isPlainObject from "./isPlainObject";

/* eslint-disable @typescript-eslint/no-explicit-any */
type AnyObject = Record<keyof any, any>;

type Merged<T, S> = { [P in keyof S]: S[P] } & {
  [K in keyof T]: K extends keyof S
    ? S[K] extends AnyObject
      ? T[K] extends AnyObject
        ? Merged<T[K], S[K]>
        : S[K]
      : S[K]
    : T[K];
};

const deepMerge = <T extends AnyObject, S extends AnyObject>(
  target: T,
  source: S,
  clone = true,
): Merged<T, S> => {
  const output: Merged<T, S> = clone ? { ...target } : target;

  if (!isPlainObject(target) || !isPlainObject(source))
    throw new Error("Invalid inputs. Provide plain objects as inputs.");

  Object.entries(source).forEach(([key, value]) => {
    if (["__proto__", "constructor", "prototype"].includes(key)) return;

    if (isPlainObject(value) && key in target) {
      // @ts-expect-error dynamic-recursive type
      output[key] = deepMerge(<T>target[key], value, clone);
      // @ts-expect-error dynamic-recursive type
    } else output[key] = value as unknown;
  });

  return output;
};

export default deepMerge;
