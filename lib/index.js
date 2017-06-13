const {
  calculateExposureValue,
  calculateFNumber,
  calculateLightValue,
  calculateShutterSpeed,
} = require('./equations');

const {
  exactSelector,
  getFNumbers,
  getShutterSpeeds,
  nominalSelector,
  nominalValue,
  notNullSelector,
} = require('./data');

function getCameraSettings(wrappedFn, fNumbers = getFNumbers(), shutterSpeeds = getShutterSpeeds()) {
  return (...args) => wrappedFn.call(this, fNumbers, shutterSpeeds, ...args);
}

function byFNumber(stops, speeds, exposureValue, filmSpeed) {
  function matchingShutterSpeed(fNumber) {
    const val = calculateShutterSpeed(exposureValue, fNumber, filmSpeed);
    const shutterSpeed = speeds.find(exactSelector(val));

    return {
      fNumber: nominalValue(fNumber),
      shutterSpeed: shutterSpeed ? nominalValue(shutterSpeed) : null,
    };
  }

  return {
    exposureValue,
    filmSpeed,
    settings: stops.map(matchingShutterSpeed).filter(notNullSelector('shutterSpeed')),
  };
}

function byShutterSpeed(stops, speeds, exposureValue, filmSpeed) {
  function matchingFNumber(shutterSpeed) {
    const val = calculateFNumber(exposureValue, shutterSpeed, filmSpeed);
    const fNumber = stops.find(exactSelector(val));

    return {
      fNumber: fNumber ? nominalValue(fNumber) : null,
      shutterSpeed: nominalValue(shutterSpeed),
    };
  }

  return {
    exposureValue,
    filmSpeed,
    settings: speeds.map(matchingFNumber).filter(notNullSelector('fNumber')),
  };
}

function getExposureValue(nominalFNumber, nominalShutterSpeed) {
  const fNumber = getFNumbers().find(nominalSelector(nominalFNumber));
  const shutterSpeed = getShutterSpeeds().find(nominalSelector(nominalShutterSpeed));
  return calculateExposureValue(fNumber, shutterSpeed);
}

function getLightValue(nominalFNumber, nominalShutterSpeed, filmSpeed, fNumbers = getFNumbers(), shutterSpeeds = getShutterSpeeds()) {
  const fNumber = fNumbers.find(nominalSelector(nominalFNumber));
  const shutterSpeed = shutterSpeeds.find(nominalSelector(nominalShutterSpeed));
  return calculateLightValue(fNumber, shutterSpeed, filmSpeed);
}

module.exports = {
  getCameraSettings,
  byShutterSpeed,
  byFNumber,
  getExposureValue,
  getLightValue,
};
