import { isNumeric } from './helpers';
import { EXPOSURE_VALUES } from './constants/exposureValue';

interface calcExposureValueI {
  (exactFNumber: number, exactShutterSpeed: number, limitRange: boolean): number | null;
}

/** Derives an absolute exposure value (EV) (not connected to filmSpeed) */
export const calcExposureValue: calcExposureValueI = function (exactFNumber, exactShutterSpeed, limitRange = true) {
  if (!isNumeric(exactFNumber) || !isNumeric(exactShutterSpeed)) {
    throw new Error();
  }

  const x = Math.round(Math.log2((exactFNumber ** 2) / exactShutterSpeed));

  if (limitRange && EXPOSURE_VALUES.indexOf(x) === -1) {
    return null;
  }

  return Math.round(x);
};

interface calcLightValueI {
  (fNumber: number, shutterSpeed: number, filmSpeed: number): number | null;
}

/** Derives an exposure value (LV) relative to ISO100 */
export const calcLightValue: calcLightValueI = function (fNumber, shutterSpeed, filmSpeed) {
  const y = Math.log2(filmSpeed / 100);
  const x = calcExposureValue(fNumber, shutterSpeed, false);

  if (x === null) { return null; }

  const result = x - y;

  if (EXPOSURE_VALUES.indexOf(result) === -1) { return null; }

  return result;
};

interface calcFNumberI {
  (ev: number, exactShutterSpeed: number, filmSpeed: number): number;
}

/** Derives exact fNumber */
export const calcFNumber: calcFNumberI = function (lightValue, exactShutterSpeed, filmSpeed) {
  if (!Number.isInteger(lightValue) || !isNumeric(exactShutterSpeed || !Number.isInteger(filmSpeed))) {
    throw new Error();
  }

  const y = (filmSpeed / 100);
  const x = Math.sqrt((2 ** lightValue) * exactShutterSpeed * y);
  return x;
};

interface calcShutterSpeedI {
  (ev: number, exactFNumber: number, filmSpeed: number): number;
}

/** Derives exact shutterSpeed */
export const calcShutterSpeed: calcShutterSpeedI = function (lightValue, exactFNumber, filmSpeed) {
  if (!Number.isInteger(lightValue) || !isNumeric(exactFNumber) || !Number.isInteger(filmSpeed)) {
    throw new Error();
  }

  const y = (filmSpeed / 100);
  const x = (exactFNumber * exactFNumber) / (2 ** lightValue);
  return x / y;
};


interface calcExactFNumberI {
  (fNumberSpeedStop: number): number;
}

/** Derives exact fNumber from the corresponding stopNumber */
export const calcExactFNumber: calcExactFNumberI = function (fNumberSpeedStop) {
  if (!Number.isInteger(fNumberSpeedStop)) {
    throw new Error();
  }

  const x = Math.sqrt(2) ** fNumberSpeedStop;
  return x;
};

interface calcExactShutterSpeedI {
  (shutterSpeedStop: number): number;
}

/** Derives exact shutterSpeed from the corresponding stopNumber */
export const calcExactShutterSpeed: calcExactShutterSpeedI = function (shutterSpeedStop) {
  if (!Number.isInteger(shutterSpeedStop)) {
    throw new Error();
  }

  const x = 2 ** shutterSpeedStop;
  return x;
};
