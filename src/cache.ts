/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/non-nullable-type-assertion-style */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-explicit-any */
export const createCache = ({ limit = 100 } = {}) => {
  let cache: Record<string, any> = {};
  let keys: string[] = [];

  return {
    get: (key: string) => cache[key],
    set: (key: string, value: any) => {
      keys.push(key);
      if (keys.length > limit) {
        delete cache[keys.shift() as string];
      }
      cache[key] = value;
    },
    reset: () => {
      cache = {};
      keys = [];
    },
    length: () => keys.length,
  };
};
