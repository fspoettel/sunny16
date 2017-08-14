import { EXPOSURE_VALUES, FILM_SPEEDS } from '../index';
import { isNumeric } from '../helpers';
import { Sunny16 } from '../sunny16';

const fNumberRange = [0.7, 520];
const shutterSpeedRange = ['1/16000', '64'];

const getInstance = (...args) => new Sunny16(...args);

describe('Sunny16', () => {
  it('initializes without throwing', () => {
    expect(() => { getInstance(); }).not.toThrow();
  });

  it('allows to set custom bounds onInit', () => {
    const { fNumbers, shutterSpeeds } = getInstance([1, 11], ['1/500', '1/8']);
    expect(fNumbers[0].nominal).toEqual(1);
    expect(fNumbers[fNumbers.length - 1].nominal).toEqual(11);
    expect(shutterSpeeds[0].nominal).toEqual('1/500');
    expect(shutterSpeeds[shutterSpeeds.length - 1].nominal).toEqual('1/8');
  });

  it('decorates the exact values for shutterSpeeds & fNumbers', () => {
    const { fNumbers, shutterSpeeds } = getInstance();
    const allValues = [...fNumbers, ...shutterSpeeds];
    allValues.forEach((value) => {
      const exactValue = value.exact;
      expect(isNumeric(exactValue)).toBeTruthy();
    });
  });

  describe('byFNumber()', () => {
    it('returns an object with a settings array', () => {
      const instance = getInstance([16, 16], ['1/250', '1/250']);
      const result = instance.byFNumber(15, 200);
      expect(result).toMatchObject({
        ev: 15,
        filmSpeed: 200,
        settings: [{
          fNumber: 16,
          shutterSpeed: '1/250',
        }],
      });
    });

    it('filters out-of-range settings', () => {
      const instance = getInstance([16, 16], ['1', '1']);
      const result = instance.byShutterSpeed(15, 200);
      expect(result.settings).toHaveLength(0);
    });

    it('matches snapshot results for all possible configurations', () => {
      const instance = getInstance(fNumberRange, shutterSpeedRange);
      const allCalculations = EXPOSURE_VALUES.map((ev) => {
        return FILM_SPEEDS.map(iso => instance.byFNumber(ev, iso));
      });

      const snapShot = JSON.stringify(allCalculations);
      expect(snapShot).toMatchSnapshot();
    });
  });

  describe('byShutterSpeed()', () => {
    it('returns an object with a settings array', () => {
      const instance = getInstance([16, 16], ['1/250', '1/250']);
      const result = instance.byShutterSpeed(15, 200);
      expect(result).toMatchObject({
        ev: 15,
        filmSpeed: 200,
        settings: [{
          fNumber: 16,
          shutterSpeed: '1/250',
        }],
      });
    });

    it('filters out-of-range settings', () => {
      const instance = getInstance([16, 16], ['1', '1']);
      const result = instance.byShutterSpeed(15, 200);
      expect(result.settings).toHaveLength(0);
    });

    it('matches snapshot results for all possible configurations', () => {
      const instance = getInstance(fNumberRange, shutterSpeedRange);
      const allCalculations = EXPOSURE_VALUES.map((ev) => {
        return FILM_SPEEDS.map(iso => instance.byShutterSpeed(ev, iso));
      });

      const snapShot = JSON.stringify(allCalculations);
      expect(snapShot).toMatchSnapshot();
    });
  });

  describe('exposureValue()', () => {
    it('returns an integer', () => {
      const instance = getInstance();
      const result = instance.exposureValue(16, '1/250');
      expect(result).toEqual(16);
    });

    it('returns null for out-of-range values', () => {
      const instance = getInstance([1, 11]);
      const result = instance.exposureValue(16, '1/250');
      expect(result).toBeNull();
    });

    it('matches snapshot results for all possible configurations', () => {
      const instance = getInstance(fNumberRange, shutterSpeedRange);
      const fNumbers = instance.getFNumbers();
      const shutterSpeeds = instance.getShutterSpeeds();
      const result = fNumbers
        .map(fNumber => shutterSpeeds
          .map(speed => instance.exposureValue(fNumber.nominal, speed.nominal)));
      const snapShot = JSON.stringify(result);
      expect(snapShot).toMatchSnapshot();
    });
  });

  describe('lightValue()', () => {
    it('returns an integer', () => {
      const instance = getInstance();
      const result = instance.lightValue(16, '1/250', 200);
      expect(result).toEqual(15);
    });

    it('returns null for out-of-range values', () => {
      const instance = getInstance([1, 11]);
      const result = instance.lightValue(16, '1/250', 200);
      expect(result).toBeNull();
    });

    it('matches snapshot results for all possible configurations', () => {
      const instance = getInstance(fNumberRange, shutterSpeedRange);
      const fNumbers = instance.getFNumbers();
      const shutterSpeeds = instance.getShutterSpeeds();
      const result = fNumbers
        .map(fNumber => shutterSpeeds
          .map(speed => FILM_SPEEDS
            .map(iso => instance.lightValue(fNumber.nominal, speed.nominal, iso))));

      const snapShot = JSON.stringify(result);
      expect(snapShot).toMatchSnapshot();
    });
  });
});

