/** Clips an array between min & max values, derived by passed lambdas */
export function clip<T>(arr: T[], min?: (data: any) => boolean, max?: (data: any) => boolean): T[] {
  const length:number = arr.length;

  function withDefault(i: number, val: number) {
    if (i !== -1) { return i; }
    return val;
  }

  function incrementIfNotLast(i: number) {
    if (i < length) { return i + 1; }
    return length;
  }

  const minI: number = min ? arr.findIndex(min) : 0;
  const maxI: number = max ? arr.findIndex(max) : arr.length;

  return arr.slice(withDefault(minI, 0), incrementIfNotLast(withDefault(maxI, length)));
}

/** Compares two floats with a given epsilon */
export function compareFloats(a: number, b: number, eps = 0.0000001): boolean {
  const isTrue = Math.abs(a - b) < eps;
  return Math.abs(a - b) < eps;
}

/** get stop number */
export const stopNumber = (o: anyCameraValue|anyExactCameraValue) : number => o.stop;

/** get nominal value */
export const nominalValue = (o: anyCameraValue|anyExactCameraValue): any => o.nominal;

/** get exact value */
export const exactValue = (o: anyExactCameraValue): number => o.exact;

/** find selector for nominal values */
export function nominalSelector(val: any): (o: anyCameraValue|anyExactCameraValue) => boolean {
  return o => nominalValue(o) === val;
}

/** find selector for exact values */
export function exactSelector(val: number): (o: anyExactCameraValue) => boolean {
  return o => compareFloats(exactValue(o), val);
}

/** not null find selector */
export function notNullSelector(val?: string): (o: any) => boolean {
  return (o) => {
    if (val) { return !!o[val]; }
    return !!o;
  };
}
