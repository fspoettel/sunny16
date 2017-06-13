const {
  byFNumber,
  byShutterSpeed,
  getCameraSettings,
  getExposureValue,
  getLightValue,
} = require('./lib');

console.log(getCameraSettings(byFNumber)(15, 200));
console.log(getCameraSettings(byShutterSpeed)(15, 200));
console.log(getLightValue(16, '1/125', 100));
console.log(getExposureValue(16, '1/1000'));
