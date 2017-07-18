import { isNumeric } from './helpers';
import { EXPOSURE_VALUES } from './constants/exposureValue';

interface calculateExposureValueI {
  (exactFNumber: number, exactShutterSpeed: number, filterOutOfRange: boolean): number | null;
}

/** Derives an absolute exposure value (EV) (not connected to filmSpeed) */
export const calculateExposureValue: calculateExposureValueI = function (exactFNumber, exactShutterSpeed, filterOutOfRange = true) {
  if (!isNumeric(exactFNumber) || !isNumeric(exactShutterSpeed)) {
    throw new Error();
  }

  const x = Math.round(Math.log2((exactFNumber ** 2) / exactShutterSpeed));

  if (filterOutOfRange && EXPOSURE_VALUES.indexOf(x) === -1) {
    return null;
  }

  return Math.round(x);
};

interface calculateLightValueI {
  (fNumber: number, shutterSpeed: number, filmSpeed: number): number | null;
}

/** Derives an exposure value (LV) relative to ISO100 */
export const calculateLightValue: calculateLightValueI = function (fNumber, shutterSpeed, filmSpeed) {
  const y = Math.log2(filmSpeed / 100);
  const x = calculateExposureValue(fNumber, shutterSpeed, false);
  
  if (x === null) { return null; }

  const result = x - y;

  if (EXPOSURE_VALUES.indexOf(result) === -1) { return null; }

  return result;
};

interface calculateFNumberI {
  (ev: number, exactShutterSpeed: number, filmSpeed: number): number;
}

/** Derives exact fNumber */
export const calculateFNumber: calculateFNumberI= function (ev, exactShutterSpeed, filmSpeed) {
  if (!Number.isInteger(ev) || !isNumeric(exactShutterSpeed || !Number.isInteger(filmSpeed))) {
    throw new Error();
  }

  const y = (filmSpeed / 100);
  const x = Math.sqrt((2 ** ev) * exactShutterSpeed * y);
  return x;
};

interface calculateShutterSpeedI {
  (ev: number, exactFNumber: number, filmSpeed: number): number;
}

/** Derives exact shutterSpeed */
export const calculateShutterSpeed: calculateShutterSpeedI = function (ev, exactFNumber, filmSpeed) {
  if (!Number.isInteger(ev) || !isNumeric(exactFNumber) || !Number.isInteger(filmSpeed)) {
    throw new Error();
  }

  const y = (filmSpeed / 100);
  const x = (exactFNumber * exactFNumber) / (2 ** ev);
  return x / y;
};


interface calculateExactFNumberI {
  (fNumberSpeedStop: number): number;
}

/** Derives exact fNumber from the corresponding stopNumber */
export const calculateExactFNumber: calculateExactFNumberI = function (fNumberSpeedStop) {
  if (!Number.isInteger(fNumberSpeedStop)) {
    throw new Error();
  }

  const x = Math.sqrt(2) ** fNumberSpeedStop;
  return x;
};

interface calculateExactShutterSpeedI {
  (shutterSpeedStop: number): number;
}

/** Derives exact shutterSpeed from the corresponding stopNumber */
export const calculateExactShutterSpeed: calculateExactShutterSpeedI = function (shutterSpeedStop) {
  if (!Number.isInteger(shutterSpeedStop)) {
    throw new Error();
  }

  const x = 2 ** shutterSpeedStop;
  return x;
};
