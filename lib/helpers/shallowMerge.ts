/* eslint-disable @typescript-eslint/no-explicit-any */
type AnyObject = Record<keyof any, any>;

type Merged<T, S> = { [K in keyof S]: S[K] } & {
  [K in keyof T]: K extends keyof S ? S[K] : T[K];
};

const isPlainObject = (x: unknown): x is AnyObject => {
  return (x && typeof x === "object" && x.constructor === Object) as boolean;
};

const shallowMerge = <T extends AnyObject, S extends AnyObject>(
  target: T,
  source: S
): Merged<T, S> => {
  if (!isPlainObject(target) || !isPlainObject(source))
    throw new Error("Invalid inputs. Provide plain objects as inputs.");

  return { ...target, ...source };
};

export default shallowMerge;
