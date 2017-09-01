import { EXPOSURE_VALUES } from './constants/exposureValue';

/** Derives an absolute exposure value (EV) (not connected to filmSpeed) */
export function calcExposureValue(exactFNumber: number, exactShutterSpeed: number, limitRange = true): number | null {
  const x = Math.round(Math.log2((exactFNumber ** 2) / exactShutterSpeed));

  if (limitRange && EXPOSURE_VALUES.indexOf(x) === -1) { return null; }
  return Math.round(x);
}

/** Derives an exposure value (LV) relative to ISO100 */
export function calcLightValue(fNumber: number, shutterSpeed: number, filmSpeed: number): number | null {
  const x = calcExposureValue(fNumber, shutterSpeed, false);
  if (x === null) { return x; }

  const result = x - Math.log2(filmSpeed / 100);

  if (EXPOSURE_VALUES.indexOf(result) === -1) { return null; }
  return result;
}

/** Derives exact fNumber */
export function calcFNumber(lightValue: number, exactShutterSpeed: number, filmSpeed: number): number {
  const y = (filmSpeed / 100);
  const x = Math.sqrt((2 ** lightValue) * exactShutterSpeed * y);
  return x;
}

/** Derives exact shutterSpeed */
export function calcShutterSpeed(lightValue: number, exactFNumber: number, filmSpeed: number): number {
  const y = (filmSpeed / 100);
  const x = (exactFNumber * exactFNumber) / (2 ** lightValue);
  return x / y;
}

/** Derives exact fNumber from the corresponding stopNumber */
export function calcExactFNumber(fNumberSpeedStop: number): number {
  const x = Math.sqrt(2) ** fNumberSpeedStop;
  return x;
}

/** Derives exact shutterSpeed from the corresponding stopNumber */
export function calcExactShutterSpeed(shutterSpeedStop: number): number {
  const x = 2 ** shutterSpeedStop;
  return x;
}
