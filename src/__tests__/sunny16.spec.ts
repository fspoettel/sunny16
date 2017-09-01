import {
  getFNumbers,
  getShutterSpeeds,
  getExposureValues,
  getFilmSpeeds,
  byFNumber,
  byShutterSpeed,
  exposureValue,
  lightValue,
} from '../sunny16';

const configAll = {
  fNumbers: getFNumbers(0.7, 520),
  shutterSpeeds: getShutterSpeeds('1/16000', '64'),
};

const fNumberRange = [0.7, 520];
const shutterSpeedRange = ['1/16000', '64'];

describe('Sunny16', () => {
  describe('byFNumber()', () => {
    it('returns an object with a settings array', () => {
      const config = {
        fNumbers: getFNumbers(16, 16),
        shutterSpeeds: getShutterSpeeds('1/250', '1/250'),
      };

      const result = byFNumber(15, 200, config);

      expect(result).toMatchObject({
        lightValue: 15,
        filmSpeed: 200,
        settings: [{
          fNumber: 16,
          shutterSpeed: '1/250',
        }],
      });
    });

    it('filters out-of-range settings', () => {
      const config = {
        fNumbers: getFNumbers(16, 16),
        shutterSpeeds: getShutterSpeeds('1', '1'),
      };

      const result = byShutterSpeed(15, 200, config);
      expect(result.settings).toHaveLength(0);
    });

    it('matches snapshot results for all possible configurations', () => {
      const exposureValues = getExposureValues();
      const filmSpeeds = getFilmSpeeds();
      const allCalculations = exposureValues.map((ev) => {
        return filmSpeeds.map(iso => byFNumber(ev, iso, configAll));
      });

      const snapShot = JSON.stringify(allCalculations);
      expect(snapShot).toMatchSnapshot();
    });
  });

  describe('byShutterSpeed()', () => {
    it('returns an object with a settings array', () => {
      const config = {
        fNumbers: getFNumbers(16, 16),
        shutterSpeeds: getShutterSpeeds('1/250', '1/250'),
      };


      const result = byShutterSpeed(15, 200, config);

      expect(result).toMatchObject({
        lightValue: 15,
        filmSpeed: 200,
        settings: [{
          fNumber: 16,
          shutterSpeed: '1/250',
        }],
      });
    });

    it('filters out-of-range settings', () => {
      const config = {
        fNumbers: getFNumbers(16, 16),
        shutterSpeeds: getShutterSpeeds('1', '1'),
      };

      const result = byShutterSpeed(15, 200, config);
      expect(result.settings).toHaveLength(0);
    });

    it('matches snapshot results for all possible configurations', () => {
      const exposureValues = getExposureValues();
      const filmSpeeds = getFilmSpeeds();

      const allCalculations = exposureValues.map((ev) => {
        return filmSpeeds.map(iso => byShutterSpeed(ev, iso, configAll));
      });

      const snapShot = JSON.stringify(allCalculations);
      expect(snapShot).toMatchSnapshot();
    });
  });

  describe('exposureValue()', () => {
    it('returns an integer', () => {
      const result = exposureValue(16, '1/250');
      expect(result).toEqual(16);
    });

    it('matches snapshot results for all possible configurations', () => {
      const fNumbers = getFNumbers();
      const shutterSpeeds = getShutterSpeeds();
      const result = fNumbers
        .map(fNumber => shutterSpeeds
          .map(speed => exposureValue(fNumber.nominal, speed.nominal)));
      const snapShot = JSON.stringify(result);
      expect(snapShot).toMatchSnapshot();
    });
  });

  describe('lightValue()', () => {
    it('returns an integer', () => {
      const result = lightValue(16, '1/250', 200);
      expect(result).toEqual(15);
    });

    it('matches snapshot results for all possible configurations', () => {
      const fNumbers = getFNumbers();
      const shutterSpeeds = getShutterSpeeds();
      const filmSpeeds = getFilmSpeeds();

      const result = fNumbers
        .map(fNumber => shutterSpeeds
          .map(speed => filmSpeeds
            .map(iso => lightValue(fNumber.nominal, speed.nominal, iso))));

      const snapShot = JSON.stringify(result);
      expect(snapShot).toMatchSnapshot();
    });
  });
});
