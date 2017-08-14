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
} from './helpers';

export class Sunny16 {
  fNumbers: FNumberExactType[];
  shutterSpeeds: ShutterSpeedExactType[];

  constructor(fNumberBounds = [], shutterSpeedBounds = []) {
    this.setFNumbers(...fNumberBounds);
    this.setShutterSpeeds(...shutterSpeedBounds);
  }

  getFNumbers(): FNumberExactType[] { return this.fNumbers; }
  getShutterSpeeds(): ShutterSpeedExactType[] { return this.shutterSpeeds; }

  /** .find for stop number */
  private stopNumber(obj: anyCameraValue|anyExactCameraValue): number {
    return obj.stop;
  }
  /** .find for nominal value */
  private nominalValue(obj: anyCameraValue|anyExactCameraValue): any {
    return obj.nominal;
  }
  /** .find for exact value */
  private exactValue(obj: anyExactCameraValue): number {
    return obj.exact;
  }

  /** array.find() selector matching exact values */
  private exactSelector(val: number): (obj:anyExactCameraValue) => boolean {
    return obj => compareFloats(this.exactValue(obj), val);
  }

  /** array.find() selector matching nominal values */
  private nominalSelector(val: any): (obj:anyExactCameraValue) => boolean {
    return obj => this.nominalValue(obj) === val;
  }

  /** array.filter() lambda that filters nulled properties */
  private notNullSelector(val?: string): (obj: any) => boolean {
    if (val) { return obj => !!obj[val]; }
    return obj => !!obj;
  }

  /** Facade for clip() */
  private setBounds(data: anyCameraValue[], min: number|string, max: number|string): any[] {
    return clip(data, this.nominalSelector(min), this.nominalSelector(max));
  }

  private setFNumberBounds(data, min, max): FNumberExactType[] {
    return this.setBounds(data, min, max);
  }

  private setShutterSpeedBounds(data, min, max): ShutterSpeedExactType[] {
    return this.setBounds(data, min, max);
  }

  /** Clips fNumbers to bounds & computes exact values */
  setFNumbers(min = 2, max = 16): FNumberExactType[] {
    const fNumbers = this.setFNumberBounds(F_NUMBERS, min, max);

    const val = fNumbers.map(fNumber => Object.assign({}, fNumber, {
      exact: calcExactFNumber(this.stopNumber(fNumber)),
    }));

    this.fNumbers = val;
    return this.fNumbers;
  }


  /** Clips this.shutterSpeeds to bounds & computes exact values */
  setShutterSpeeds(min = '1/1000', max = '1') {
    const shutterSpeeds = this.setShutterSpeedBounds(SHUTTER_SPEEDS, min, max);

    const val = shutterSpeeds.map(shutterSpeed => Object.assign({}, shutterSpeed, {
      exact: calcExactShutterSpeed(this.stopNumber(shutterSpeed)),
    }));

    this.shutterSpeeds = val;
    return this.shutterSpeeds;
  }

  /** Get camera settings for EV & filmSpeed, computing shutterSpeeds */
  byFNumber(ev: number, filmSpeed: number): cameraSettings {
    const fNumbers = this.getFNumbers();
    const shutterSpeeds = this.getShutterSpeeds();

    const matchingShutterSpeed = (fNumber: FNumberExactType): cameraSetting => {
      const val = calcShutterSpeed(ev, this.exactValue(fNumber), filmSpeed);
      const shutterSpeed = shutterSpeeds.find(this.exactSelector(val));

      return {
        fNumber: this.nominalValue(fNumber),
        shutterSpeed: shutterSpeed ? this.nominalValue(shutterSpeed) : null,
      };
    };

    return {
      ev,
      filmSpeed,
      settings: fNumbers.map(matchingShutterSpeed).filter(this.notNullSelector('shutterSpeed')),
    };
  }

  /** Get camera settings for EV & filmSpeed, computing fNumbers */
  byShutterSpeed(ev: number, filmSpeed: number): cameraSettings {
    const fNumbers = this.getFNumbers();
    const shutterSpeeds = this.getShutterSpeeds();

    const matchingFNumber = (shutterSpeed: ShutterSpeedExactType): cameraSetting => {
      const val = calcFNumber(ev, this.exactValue(shutterSpeed), filmSpeed);
      const fNumber = fNumbers.find(this.exactSelector(val));

      return {
        fNumber: fNumber ? this.nominalValue(fNumber) : null,
        shutterSpeed: this.nominalValue(shutterSpeed),
      };
    };

    return {
      ev,
      filmSpeed,
      settings: shutterSpeeds.map(matchingFNumber).filter(this.notNullSelector('fNumber')),
    };
  }

  /** Get EV for fNumber & shutterSpeed (in nominal representaiton) */
  exposureValue(nominalFNumber: number, nominalShutterSpeed: string): number|null {
    const fNumbers = this.getFNumbers();
    const shutterSpeeds = this.getShutterSpeeds();

    const fNumber = fNumbers.find(this.nominalSelector(nominalFNumber));
    const shutterSpeed = shutterSpeeds.find(this.nominalSelector(nominalShutterSpeed));

    if (!fNumber || !shutterSpeed) { return null; }

    return calcExposureValue(this.exactValue(fNumber), this.exactValue(shutterSpeed), true);
  }

  /** Get LV for fNumber & shutterSpeed and target filmSpeed (in nominal representaiton) */
  lightValue(nominalFNumber: number, nominalShutterSpeed: string, filmSpeed: number): number|null {
    const fNumbers = this.getFNumbers();
    const shutterSpeeds = this.getShutterSpeeds();

    const fNumber = fNumbers.find(this.nominalSelector(nominalFNumber));
    const shutterSpeed = shutterSpeeds.find(this.nominalSelector(nominalShutterSpeed));

    if (!fNumber || !shutterSpeed) { return null; }

    return calcLightValue(this.exactValue(fNumber), this.exactValue(shutterSpeed), filmSpeed);
  }
}
