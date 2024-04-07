/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-explicit-any */

const withDevOnly = <F extends (...args: any) => any>(logFn: F) => {
  return (...args: Parameters<F>) => {
    if (process.env.NODE_ENV === "production") return;

    logFn.apply("[ReactDesignTokens]<DEVONLY_MESSAGE>:", args);
  };
};

export const info = withDevOnly(console.log);
export const error = withDevOnly(console.error);
export const warn = withDevOnly(console.warn);
