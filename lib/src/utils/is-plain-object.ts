// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable @typescript-eslint/no-explicit-any */

/** Returns `true` if `x` is a plain object (created via `{}` or `Object.create(null)`). */
export const isPlainObject = (x: unknown): x is Record<keyof any, any> => {
  return (x && typeof x === "object" && x.constructor === Object) as boolean;
};
