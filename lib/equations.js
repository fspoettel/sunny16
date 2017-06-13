const { exactValue, stopNumber } = require('./data');

const compareFloats = (a, b, eps = 0.00001) => Math.abs(a - b) < eps;

function exactFNumber(fNumber) {
  const x = Math.sqrt(2) ** stopNumber(fNumber);
  return x;
}

function exactShutterSpeed(shutterSpeed) {
  const x = 2 ** stopNumber(shutterSpeed);
  return x;
}

function calculateExposureValue(fNumber, shutterSpeed) {
  const x = Math.log2((exactValue(fNumber) ** 2) / exactValue(shutterSpeed));
  return Math.round(x);
}

function calculateLightValue(fNumber, shutterSpeed, filmSpeed) {
  const x = calculateExposureValue(fNumber, shutterSpeed);
  const y = Math.log2(filmSpeed / 100);
  return x - y;
}

function calculateShutterSpeed(exposureValue, fNumber, filmSpeed) {
  const x = (exactValue(fNumber) * exactValue(fNumber)) / (2 ** exposureValue) / (filmSpeed / 100);
  return x;
}

function calculateFNumber(exposureValue, shutterSpeed, filmSpeed) {
  const x = Math.sqrt((2 ** exposureValue) * exactValue(shutterSpeed) * (filmSpeed / 100));
  return x;
}

module.exports = {
  calculateFNumber,
  calculateExposureValue,
  calculateLightValue,
  calculateShutterSpeed,
  compareFloats,
  exactFNumber,
  exactShutterSpeed,
};
