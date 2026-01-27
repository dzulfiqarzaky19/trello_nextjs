export const isFile = (val: unknown): val is File => {
  return typeof val === 'object' && val !== null && val instanceof File;
};
