const { Sunny16 } = require('./dist');
const { FILM_SPEEDS } = require('./dist/constants/filmSpeed');
const { EXPOSURE_VALUES } = require('./dist/constants/exposureValue');

const sunny16 = new Sunny16([1, 520], ['1/16000', '64']);

FILM_SPEEDS.forEach((speed) => {
  EXPOSURE_VALUES.forEach((ev) => {
    console.log(sunny16.byFNumber(ev, speed));
  });
});
