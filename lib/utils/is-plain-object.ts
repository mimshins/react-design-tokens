// eslint-disable-next-line @typescript-eslint/no-explicit-any
const isPlainObject = (x: unknown): x is Record<keyof any, any> => {
  return (x && typeof x === "object" && x.constructor === Object) as boolean;
};

export default isPlainObject;
