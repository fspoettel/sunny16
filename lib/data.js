const shutterSpeeds = require('../constants/shutterSpeed');
const fNumbers = require('../constants/fNumber');

const compareFloats = (a, b, eps = 0.00001) => Math.abs(a - b) < eps;


/**
 * Gets exact value for fNumber / shutterSpeed collections
 * @param  {Array} arr
 */
const exactValue = arr => arr[2];

/**
 * Gets nominal value for fNumber / shutterSpeed collections
 * @param  {Array} arr
 */
const nominalValue = arr => arr[1];

/**
 * Gets stopNumber for fNumber / shutterSpeed collections
 * @param  {Array} arr
 */
const stopNumber = arr => arr[0];

function exactSelector(val) {
  return arr => compareFloats(exactValue(arr), val);
}

function nominalSelector(val) {
  return arr => nominalValue(arr) === val;
}

function notNullSelector(prop) {
  return arr => arr[prop] !== null;
}

function clip(collection = [], min, max) {
  if (!Array.isArray(collection)) { return []; }

  const length = collection.length;

  const withDefault = (i, val) => (i !== -1 ? i : val);
  const incrementIfNotLast = i => (i < length ? i + 1 : length);

  const minI = collection.findIndex(min);
  const maxI = collection.findIndex(max);

  return collection.slice(withDefault(minI, 0), incrementIfNotLast(withDefault(maxI, length)));
}

function setBounds(data, min, max) {
  return clip(
    data,
    nominalSelector(min),
    nominalSelector(max),
  );
}

function exactFNumber(fNumber) {
  const x = Math.sqrt(2) ** stopNumber(fNumber);
  return x;
}

function exactShutterSpeed(shutterSpeed) {
  const x = 2 ** stopNumber(shutterSpeed);
  return x;
}

function getFNumbers(min = 2, max = 16) {
  return setBounds(fNumbers, min, max)
    .map(fNumber => [...fNumber, exactFNumber(fNumber)]);
}

function getShutterSpeeds(min = '1/1000', max = '1') {
  return setBounds(shutterSpeeds, min, max)
    .map(shutterSpeed => [...shutterSpeed, exactShutterSpeed(shutterSpeed)]);
}

module.exports = {
  exactSelector,
  exactValue,
  getFNumbers,
  getShutterSpeeds,
  nominalSelector,
  nominalValue,
  notNullSelector,
  stopNumber,
};
