interface clipI {
  (arr: any[], min: (data: any) => boolean, max: (data: any) => boolean): any[];
}

/** Clips an array between min & max values, derived by passed lambdas */
export const clip: clipI = function (arr, min, max) {
  const length:number = arr.length;

  const withDefault = (i: number, val: number) => (i !== -1 ? i : val);
  const incrementIfNotLast = (i: number) => (i < length ? i + 1 : length);

  const minI: number = arr.findIndex(min);
  const maxI: number = arr.findIndex(max);

  return arr.slice(withDefault(minI, 0), incrementIfNotLast(withDefault(maxI, length)));
};

interface isNumericI {
  (n: any): boolean;
}

/** Checks if a value is numeric */
export const isNumeric: isNumericI = function (n) {
  return !isNaN(parseFloat(n)) && isFinite(n);
};


interface compareFloatsI {
  (a: number, b: number, eps?: number): boolean;
}

/** Compares two floats with a given epsilon */
export const compareFloats: compareFloatsI = function (a, b, eps = 0.0000001) {
  const isTrue = Math.abs(a - b) < eps;
  return Math.abs(a - b) < eps;
};
