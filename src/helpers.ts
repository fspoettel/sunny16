/** Clips an array between min & max values, derived by passed lambdas */
interface clipI {
  (arr: any[], min?: (data: any) => boolean, max?: (data: any) => boolean): any[];
}

export const clip: clipI = function (arr, min, max) {
  const length:number = arr.length;

  const withDefault = (i: number, val: number) => {
    if (i !== -1) { return i; }
    return val;
  };

  const incrementIfNotLast = (i: number) => {
    if (i < length) { return i + 1; }
    return length;
  };

  const minI: number = min ? arr.findIndex(min) : 0;
  const maxI: number = max ? arr.findIndex(max) : arr.length;

  return arr.slice(withDefault(minI, 0), incrementIfNotLast(withDefault(maxI, length)));
};

/** Checks if a value is numeric */
interface isNumericI {
  (n: any): boolean;
}

export const isNumeric: isNumericI = function (n) {
  return !isNaN(parseFloat(n)) && isFinite(n);
};

/** Compares two floats with a given epsilon */
interface compareFloatsI {
  (a: number, b: number, eps?: number): boolean;
}

export const compareFloats: compareFloatsI = function (a, b, eps = 0.0000001) {
  const isTrue = Math.abs(a - b) < eps;
  return Math.abs(a - b) < eps;
};

/** get stop number */
interface stopNumberI {
  (o: anyCameraValue|anyExactCameraValue) : number;
}

export const stopNumber: stopNumberI = o => o.stop;

/** get nominal value */
interface nominalValueI {
  (o: anyCameraValue|anyExactCameraValue): any;
}

export const nominalValue: nominalValueI = o => o.nominal;

/** get exact value */
interface exactValueI {
  (o: anyExactCameraValue): number;
}

export const exactValue: exactValueI = o => o.exact;

/** find selector for nominal values */
interface nominalSelectorI {
  (val: any): (o: anyCameraValue|anyExactCameraValue) => boolean;
}

export const nominalSelector: nominalSelectorI = val => o => nominalValue(o) === val;


/** find selector for exact values */
interface exactSelectorI {
  (val: number): (o: anyExactCameraValue) => boolean;
}

export const exactSelector = val => o => compareFloats(exactValue(o), val);


/** not null find selector */
interface notNullSelectorI {
  (val?: string): (o: any) => boolean;
}

export const notNullSelector: notNullSelectorI = val => (o) => {
  if (val) { return !!o[val]; }
  return !!o;
};

