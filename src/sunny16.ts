import { F_NUMBERS } from './constants/fNumber';
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

/** clips an array with two bound functions */
interface setBoundsI {
  (data: anyCameraValue[], min?: number|string, max?: number|string): any;
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
  if (!min && !max) { return F_NUMBERS; }
  return setFNumberBounds(F_NUMBERS, min, max);
};

/** gets (clipped) shutterSpeeds */
interface getShutterSpeedsI {
  (min?: string, max?: string): ShutterSpeedType[];
}

export const getShutterSpeeds: getShutterSpeedsI = function (min, max) {
  if (!min && !max) { return SHUTTER_SPEEDS; }
  return setShutterSpeedBounds(SHUTTER_SPEEDS, min, max);
}
;

/** Calculates LightValue by fNumber */
interface byFNumberI {
  (ev: number, filmSpeed: number, config?: configI): cameraSettings;
}

export const byFNumber: byFNumberI =  function (ev, filmSpeed, config) {
  const fNumberArr = (config && config.fNumbers) || getFNumbers(2, 16);
  const shutterSpeedArr = (config && config.shutterSpeeds) || getShutterSpeeds('1/1000', '1');

  const fNumbers = decorateExactFNumbers(fNumberArr);
  const shutterSpeeds = decorateExactShutterSpeeds(shutterSpeedArr);

  const matchingShutterSpeed = (fNumber: FNumberExactType): cameraSetting => {
    const val = calcShutterSpeed(ev, exactValue(fNumber), filmSpeed);
    const shutterSpeed = shutterSpeeds.find(exactSelector(val));

    return {
      fNumber: nominalValue(fNumber),
      shutterSpeed: shutterSpeed ? nominalValue(shutterSpeed) : null,
    };
  };

  return {
    ev,
    filmSpeed,
    settings: fNumbers.map(matchingShutterSpeed).filter(notNullSelector('shutterSpeed')),
  };
};

/** Calculates LightValue by fNumber */
interface byShutterSpeedI {
  (ev: number, filmSpeed: number, config?: configI): cameraSettings;
}

export const byShutterSpeed: byShutterSpeedI = function (ev, filmSpeed, config) {
  const fNumberArr = (config && config.fNumbers) || getFNumbers(2, 16);
  const shutterSpeedArr = (config && config.shutterSpeeds) || getShutterSpeeds('1/1000', '1');

  const fNumbers = decorateExactFNumbers(fNumberArr);
  const shutterSpeeds = decorateExactShutterSpeeds(shutterSpeedArr);

  const matchingFNumber = (shutterSpeed: ShutterSpeedExactType): cameraSetting => {
    const val = calcFNumber(ev, exactValue(shutterSpeed), filmSpeed);
    const fNumber = fNumbers.find(exactSelector(val));

    return {
      fNumber: fNumber ? nominalValue(fNumber) : null,
      shutterSpeed: nominalValue(shutterSpeed),
    };
  };

  return {
    ev,
    filmSpeed,
    settings: shutterSpeeds.map(matchingFNumber).filter(notNullSelector('fNumber')),
  };
};

/** Calculates ExposureValue */
interface exposureValueI {
  (nominalFNumber: number, nominalShutterSpeed: string, config?: configI): number|null;
}

export const exposureValue: exposureValueI = function (nominalFNumber, nominalShutterSpeed, config) {
  const fNumberArr = (config && config.fNumbers) || getFNumbers();
  const shutterSpeedArr = (config && config.shutterSpeeds) || getShutterSpeeds();

  const fNumbers = decorateExactFNumbers(fNumberArr);
  const shutterSpeeds = decorateExactShutterSpeeds(shutterSpeedArr);

  const fNumber = fNumbers.find(nominalSelector(nominalFNumber));
  const shutterSpeed = shutterSpeeds.find(nominalSelector(nominalShutterSpeed));

  if (!fNumber || !shutterSpeed) { return null; }

  return calcExposureValue(exactValue(fNumber), exactValue(shutterSpeed), true);
};

/** Get LV for fNumber & shutterSpeed and target filmSpeed (in nominal representaiton) */
interface lightValueI {
  (nominalFNumber: number, nominalShutterSpeed: string, filmSpeed: number, config?: configI): number|null;
}

export const lightValue: lightValueI = function (nominalFNumber, nominalShutterSpeed, filmSpeed, config) {
  const fNumberArr = (config && config.fNumbers) || getFNumbers();
  const shutterSpeedArr = (config && config.shutterSpeeds) || getShutterSpeeds();

  const fNumbers = decorateExactFNumbers(fNumberArr);
  const shutterSpeeds = decorateExactShutterSpeeds(shutterSpeedArr);

  const fNumber = fNumbers.find(nominalSelector(nominalFNumber));
  const shutterSpeed = shutterSpeeds.find(nominalSelector(nominalShutterSpeed));

  if (!fNumber || !shutterSpeed) { return null; }

  return calcLightValue(exactValue(fNumber), exactValue(shutterSpeed), filmSpeed);
};
