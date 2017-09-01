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
interface setBoundsI {
  (data: any[], min?: number|string, max?: number|string): any;
}

const setBounds: setBoundsI = function (data, min, max) {
  const minVal = min ? nominalSelector(min) : undefined;
  const maxVal = max ? nominalSelector(max) : undefined;

  return clip(data, minVal, maxVal);
};

/** setBounds for fNumbers */
const setFNumberBounds = function (data: FNumberType[], min?: number, max?: number): FNumberType[] {
  return setBounds(data, min, max);
};

/** setBounds for shutterSpeeds */
const setShutterSpeedBounds = function (data:ShutterSpeedType[], min?: string, max?: string): ShutterSpeedType[] {
  return setBounds(data, min, max);
};

/** setBounds for numerical values */
const setNumberBounds = function (data:number[], min?: number, max?: number): number[] {
  return setBounds(data, min, max);
};

/** Decorates the exact fNumber value */
interface decorateExactFNumbersI {
  (fNumbers: FNumberType[]): FNumberExactType[];
}

const decorateExactFNumbers: decorateExactFNumbersI = function (fNumbers) {
  return fNumbers.map(fNumber => Object.assign({}, fNumber, {
    exact: calcExactFNumber(stopNumber(fNumber)),
  }));
};

interface decorateExactShutterSpeedI {
  (shutterSpeeds: ShutterSpeedType[]): ShutterSpeedExactType[];
}

const decorateExactShutterSpeeds: decorateExactShutterSpeedI = function (shutterSpeeds) {
  return shutterSpeeds.map(shutterSpeed => Object.assign({}, shutterSpeed, {
    exact: calcExactShutterSpeed(stopNumber(shutterSpeed)),
  }));
};

/** gets (clipped) fNumbers */
interface getFNumbersI {
  (min?: number, max?: number): FNumberType[];
}

export const getFNumbers: getFNumbersI = function (min, max) {
  if (!validateNumber(min, false)) {
    throw new Sunny16Exception(`Called with wrongly typed argument min(${min}), expecting number.`);
  }

  if (!validateNumber(max, false)) {
    throw new Sunny16Exception(`Called with wrongly typed argument max(${max}), expecting number.`);
  }

  if (!min && !max) { return F_NUMBERS; }
  return setFNumberBounds(F_NUMBERS, min, max);
};

/** gets (clipped) shutterSpeeds */
interface getShutterSpeedsI {
  (min?: string, max?: string): ShutterSpeedType[];
}

export const getShutterSpeeds: getShutterSpeedsI = function (min, max) {
  if (!validateString(min, false)) {
    throw new Sunny16Exception(`Called with wrongly typed argument min(${min}), expecting string.`);
  }

  if (!validateString(max, false)) {
    throw new Sunny16Exception(`Called with wrongly typed argument max(${max}), expecting string.`);
  }

  if (!min && !max) { return SHUTTER_SPEEDS; }
  return setShutterSpeedBounds(SHUTTER_SPEEDS, min, max);
};

/** gets (clipped) filmSpeeds */

interface getFilmSpeedsI {
  (min?: number, max?: number): number[];
}

export const getFilmSpeeds: getFilmSpeedsI = function (min, max) {
  if (!validateNumber(min, false)) {
    throw new Sunny16Exception(`Called with wrongly typed argument min(${min}), expecting number.`);
  }

  if (!validateNumber(max, false)) {
    throw new Sunny16Exception(`Called with wrongly typed argument max(${max}), expecting number.`);
  }

  if (!min && !max) { return FILM_SPEEDS; }
  return setNumberBounds(FILM_SPEEDS, min, max);
};

/** gets (clipped) exposureValues */

interface getExposureValuesI {
  (min?: number, max?: number): number[];
}

export const getExposureValues: getExposureValuesI = function (min, max) {
  if (!validateNumber(min, false)) {
    throw new Sunny16Exception(`Called with wrongly typed argument min(${min}), expecting number.`);
  }

  if (!validateNumber(max, false)) {
    throw new Sunny16Exception(`Called with wrongly typed argument max(${max}), expecting number.`);
  }

  if (!min && !max) { return EXPOSURE_VALUES; }
  return setNumberBounds(EXPOSURE_VALUES, min, max);
};

/** Calculates LightValue by fNumber */
interface byFNumberI {
  (lightValue: number, filmSpeed: number, config?: configI): cameraSettings;
}

export const byFNumber: byFNumberI =  function (lightValue, filmSpeed, config) {
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
};

/** Calculates LightValue by fNumber */
interface byShutterSpeedI {
  (lightValue: number, filmSpeed: number, config?: configI): cameraSettings;
}

export const byShutterSpeed: byShutterSpeedI = function (lightValue, filmSpeed, config) {
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
};

/** Calculates ExposureValue */
interface exposureValueI {
  (nominalFNumber: number, nominalShutterSpeed: string): number|null;
}

export const exposureValue: exposureValueI = function (nominalFNumber, nominalShutterSpeed) {
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
};

/** Get LV for fNumber & shutterSpeed and target filmSpeed (in nominal representation) */
interface lightValueI {
  (nominalFNumber: number, nominalShutterSpeed: string, filmSpeed: number): number|null;
}

export const lightValue: lightValueI = function (nominalFNumber, nominalShutterSpeed, filmSpeed) {
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
};

/** Public API cameraSettings alias */
export const cameraSettings = byShutterSpeed;
