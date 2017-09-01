import { EXPOSURE_VALUES } from './constants/exposureValue';
import { F_NUMBERS } from './constants/fNumber';
import { FILM_SPEEDS } from './constants/filmSpeed';
import { SHUTTER_SPEEDS } from './constants/shutterSpeed';

import {
  calcExposureValue,
  calcFNumber,
  calcLightValue,
  calcShutterSpeed,
  calcExactFNumber,
  calcExactShutterSpeed,
} from './equations';

import {
  clip,
  compareFloats,
  exactSelector,
  exactValue,
  nominalSelector,
  nominalValue,
  notNullSelector,
  stopNumber,
} from './helpers';

import {
  validateNumber,
  validateString,
  validateConfig,
  Sunny16Exception,
} from './validation';

/** clips an array with two bound functions */
function setBounds<T>(data: T[], min?: any, max?: any): T[] {
  const minVal = min ? nominalSelector(min) : undefined;
  const maxVal = max ? nominalSelector(max) : undefined;

  return clip<T>(data, minVal, maxVal);
}

/** Decorates the exact fNumber value */
function decorateExactFNumbers(fNumbers: FNumberType[]): FNumberExactType[] {
  return fNumbers.map(fNumber => Object.assign({}, fNumber, {
    exact: calcExactFNumber(stopNumber(fNumber)),
  }));
}

/** Decorates the exact shutterSpeed value */
function decorateExactShutterSpeeds(shutterSpeeds: ShutterSpeedType[]): ShutterSpeedExactType[] {
  return shutterSpeeds.map(shutterSpeed => Object.assign({}, shutterSpeed, {
    exact: calcExactShutterSpeed(stopNumber(shutterSpeed)),
  }));
}

/** gets (clipped) fNumbers */
export function getFNumbers(min?: number, max?: number):FNumberType[]  {
  if (!validateNumber(min, false)) {
    throw new Sunny16Exception(`Called with wrongly typed argument min(${min}), expecting number.`);
  }

  if (!validateNumber(max, false)) {
    throw new Sunny16Exception(`Called with wrongly typed argument max(${max}), expecting number.`);
  }

  if (!min && !max) { return F_NUMBERS; }
  return setBounds<FNumberType>(F_NUMBERS, min, max);
}

/** gets (clipped) shutterSpeeds */
export function getShutterSpeeds(min?: string, max?: string): ShutterSpeedType[] {
  if (!validateString(min, false)) {
    throw new Sunny16Exception(`Called with wrongly typed argument min(${min}), expecting string.`);
  }

  if (!validateString(max, false)) {
    throw new Sunny16Exception(`Called with wrongly typed argument max(${max}), expecting string.`);
  }

  if (!min && !max) { return SHUTTER_SPEEDS; }
  return setBounds<ShutterSpeedType>(SHUTTER_SPEEDS, min, max);
}

/** gets (clipped) filmSpeeds */
export function getFilmSpeeds(min?: number, max?: number): number[] {
  if (!validateNumber(min, false)) {
    throw new Sunny16Exception(`Called with wrongly typed argument min(${min}), expecting number.`);
  }

  if (!validateNumber(max, false)) {
    throw new Sunny16Exception(`Called with wrongly typed argument max(${max}), expecting number.`);
  }

  if (!min && !max) { return FILM_SPEEDS; }
  return setBounds<number>(FILM_SPEEDS, min, max);
}

/** gets (clipped) exposureValues */
export function getExposureValues(min?: number, max?: number): number[] {
  if (!validateNumber(min, false)) {
    throw new Sunny16Exception(`Called with wrongly typed argument min(${min}), expecting number.`);
  }

  if (!validateNumber(max, false)) {
    throw new Sunny16Exception(`Called with wrongly typed argument max(${max}), expecting number.`);
  }

  if (!min && !max) { return EXPOSURE_VALUES; }
  return setBounds<number>(EXPOSURE_VALUES, min, max);
}

/** Calculates LightValue by fNumber */
export function byFNumber(lightValue: number, filmSpeed: number, config?: configI): cameraSettings {
  if (!validateNumber(lightValue, true)) {
    throw new Sunny16Exception(`Called with wrongly typed argument lightValue(${lightValue}), expecting number.`);
  }

  if (!validateNumber(filmSpeed, true)) {
    throw new Sunny16Exception(`Called with wrongly typed argument filmSpeed(${filmSpeed}), expecting number.`);
  }

  if (!validateConfig(config)) {
    throw new Sunny16Exception('Called with an invalid config.');
  }

  const fNumberArr = (config && config.fNumbers) || getFNumbers(2, 16);
  const shutterSpeedArr = (config && config.shutterSpeeds) || getShutterSpeeds('1/1000', '1');

  const fNumbers = decorateExactFNumbers(fNumberArr);
  const shutterSpeeds = decorateExactShutterSpeeds(shutterSpeedArr);

  const matchingShutterSpeed = (fNumber: FNumberExactType): cameraSetting => {
    const val = calcShutterSpeed(lightValue, exactValue(fNumber), filmSpeed);
    const shutterSpeed = shutterSpeeds.find(exactSelector(val));

    return {
      fNumber: nominalValue(fNumber),
      shutterSpeed: shutterSpeed ? nominalValue(shutterSpeed) : null,
    };
  };

  return {
    lightValue,
    filmSpeed,
    settings: fNumbers.map(matchingShutterSpeed).filter(notNullSelector('shutterSpeed')),
  };
}

/** Calculates LightValue by fNumber */
export function byShutterSpeed(lightValue: number, filmSpeed: number, config?: configI): cameraSettings {
  if (!validateNumber(lightValue, true)) {
    throw new Sunny16Exception(`Called with wrongly typed argument lightValue(${lightValue}), expecting number.`);
  }

  if (!validateNumber(filmSpeed, true)) {
    throw new Sunny16Exception(`Called with wrongly typed argument filmSpeed(${filmSpeed}), expecting number.`);
  }

  if (!validateConfig(config)) {
    throw new Sunny16Exception(`Called with invalid config (${config}).`);
  }

  const fNumberArr = (config && config.fNumbers) || getFNumbers(2, 16);
  const shutterSpeedArr = (config && config.shutterSpeeds) || getShutterSpeeds('1/1000', '1');

  const fNumbers = decorateExactFNumbers(fNumberArr);
  const shutterSpeeds = decorateExactShutterSpeeds(shutterSpeedArr);

  const matchingFNumber = (shutterSpeed: ShutterSpeedExactType): cameraSetting => {
    const val = calcFNumber(lightValue, exactValue(shutterSpeed), filmSpeed);
    const fNumber = fNumbers.find(exactSelector(val));

    return {
      fNumber: fNumber ? nominalValue(fNumber) : null,
      shutterSpeed: nominalValue(shutterSpeed),
    };
  };

  return {
    lightValue,
    filmSpeed,
    settings: shutterSpeeds.map(matchingFNumber).filter(notNullSelector('fNumber')),
  };
}

/** Calculates ExposureValue */
export function exposureValue(nominalFNumber: number, nominalShutterSpeed: string): number|null {
  if (!validateNumber(nominalFNumber, true)) {
    throw new Sunny16Exception(
      `Called with wrongly typed argument nominalFNumber(${nominalFNumber}), expecting number.`,
    );
  }

  if (!validateString(nominalShutterSpeed, true)) {
    throw new Sunny16Exception(
      `Called with wrongly typed argument nominalShutterSpeed(${nominalShutterSpeed}), expecting string.`,
    );
  }

  const fNumbers = decorateExactFNumbers(getFNumbers());
  const shutterSpeeds = decorateExactShutterSpeeds(getShutterSpeeds());

  const fNumber = fNumbers.find(nominalSelector(nominalFNumber));
  const shutterSpeed = shutterSpeeds.find(nominalSelector(nominalShutterSpeed));

  if (!fNumber || !shutterSpeed) { return null; }

  return calcExposureValue(exactValue(fNumber), exactValue(shutterSpeed), true);
}

/** Get LV for fNumber & shutterSpeed and target filmSpeed (in nominal representation) */
export function lightValue(nominalFNumber: number, nominalShutterSpeed: string, filmSpeed: number): number|null {
  if (!validateNumber(nominalFNumber, true)) {
    throw new Sunny16Exception(
      `Called with wrongly typed argument nominalFNumber(${nominalFNumber}), expecting number.`,
    );
  }

  if (!validateString(nominalShutterSpeed, true)) {
    throw new Sunny16Exception(
      `Called with wrongly typed argument nominalShutterSpeed(${nominalShutterSpeed}), expecting string.`,
    );
  }

  const fNumbers = decorateExactFNumbers(getFNumbers());
  const shutterSpeeds = decorateExactShutterSpeeds(getShutterSpeeds());

  const fNumber = fNumbers.find(nominalSelector(nominalFNumber));
  const shutterSpeed = shutterSpeeds.find(nominalSelector(nominalShutterSpeed));

  if (!fNumber || !shutterSpeed) { return null; }

  return calcLightValue(exactValue(fNumber), exactValue(shutterSpeed), filmSpeed);
}

/** cameraSettings alias */
export const cameraSettings = byShutterSpeed;
