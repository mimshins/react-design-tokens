import isPlainObject from "./is-plain-object";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyObject = Record<keyof any, any>;

type Merged<T, S> = { [K in keyof S]: S[K] } & {
  [K in keyof T]: K extends keyof S ? S[K] : T[K];
};

const shallowMerge = <T extends AnyObject, S extends AnyObject>(
  target: T,
  source: S,
): Merged<T, S> => {
  if (!isPlainObject(target) || !isPlainObject(source)) {
    throw new Error("Invalid inputs. Provide plain objects as inputs.");
  }

  return { ...target, ...source };
};

export default shallowMerge;
