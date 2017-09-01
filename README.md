# sunny16

`sunny16` provides low-level calculations for the photographic units `ExposureValue` and `LightValue`. It is written in Typescript, well-tested and based on the underlying math detailed [here](#).

## Install

Run `yarn add sunny16` or `npm install sunny16`

## Constants & Terminology

The module comes with a set of data located in `/constants/`. Each data type can be accessed via a getter that supports clipping the data to different camera configurations.

### shutterSpeeds

ShutterSpeeds are stored as objects that map a stopNumber to a nominal value. The exact value is derived from the stopNumber during calculations.

``` js
  { stop: -14, nominal:'1/16000' }
```

To retrieve and customize shutterSpeeds, the getter `getShutterSpeeds(min?, max?)` can be used. `min/max` are optional and can be set by passing a nominal value.

``` js
import { getShutterSpeeds } from 'sunny16';

const allShutterSpeeds = getShutterSpeeds();
const leicaShutterSpeeds = getShutterSpeeds('1/1000', '1');
```

### fNumbers
fNumbers (commonly referred to as *Apertures*) are stored as objects that map a stopNumber to a nominal value. The exact value is derived from the stopNumber during calculations.

``` js
{ stop: -1, nominal: 0.7 },
```

To retrieve and customize shutterSpeeds, the getter `getFNumbers(min?, max?)` can be used. `min/max` are optional and can be set by passing a nominal value.

``` js
import { getFNumbers } from 'sunny16';

const allFNumbers = getFNumbers();
const summicronFNumbers = getShutterSpeeds(2, 16);
```

### filmSpeeds

filmSpeeds are stored as numbers. To retrieve filmSpeeds, the getter `getFilmSpeeds(min?, max?)` can be used. `min/max` are optional and can be set by passing a number.

``` js
import { getFilmSpeeds } from 'sunny16';

const allFNumbers = getFilmSpeeds();
const summicronFNumbers = getFilmSpeeds(100, 400);
```

### exposureValues / lightValues

ExposureValues describe the sensitivity to light. When related to a given filmSpeed, it can be used to determine correct camera settings for given lighting situations (the sunny16-rule works this way).

To retrieve exposureValues, the getter `getExposureValues(min?, max?)` can be used. `min/max` are optional and can be set by passing a number.

``` js
import { getExposureValues } from 'sunny16';

const allFNumbers = getExposureValues();
const summicronFNumbers = getExposureValues(-6, 21);
```

### CameraSetting

A single camera setting (returned by `cameraSettings()`) has the shape:

``` js
  {
    fNumber: 5.6
    shutterSpeed: '1/200'
  }
```

### config

A config object can be passed to `cameraSettings()` to pass camera-configuration. It has the shape:

```
  {
    fNumbers: getFNumbers(),
    shutterSpeeds: getShutterSpeeds(),
  }
```

## Calculations

### Get cameraSettings for a lightValue/filmSpeed combination

*cameraSettings(lightValue, filmSpeed, config?)*

* **lightValue** `number`: target lightValue
* **filmSpeed** `number`: target filmSpeed
* **config** `object`: configuration object, defaults to shutterSpeeds '1/1000'–'1' and apertures 2–16
* **returns**:
    ```
      {
        lightValue: number,
        filmSpeed: number,
        cameraSettings: cameraSetting[],
      }
    ```

``` js
import {
  cameraSettings,
  getFNumbers,
  getShutterSpeeds,
} from 'sunny16';

const config = {
  fNumbers: getFNumbers(2, 16),
  shutterSpeeds: getShutterSpeeds('1/1000', '1'),
};

const sunny16Settings = cameraSettings(15, 200, config);
```

*Returned settings that are outside of config range will be filtered.*

### Get a lightValue for a given cameraSetting and filmSpeed

*lightValue(nominalFNumber, nominalShutterSpeed, filmSpeed)*

* **nominalFNumber** `number`: fNumber (in nominal representation)
* **nominalShutterSpeed** `string`: shutterSpeed (in nominal representation)
* **filmSpeed** `number`: filmSpeed
* **returns**: `number`

``` js
import { lightValue } from 'sunny16';

const lightValue = cameraSettings(2, '1/1000', 200);
```

### Get an exposureValue for a given cameraSetting

*exposureValue(nominalFNumber, nominalShutterSpeed)*

* **nominalFNumber** `number`: fNumber (in nominal representation)
* **nominalShutterSpeed** `string`: shutterSpeed (in nominal representation)
* **returns**: `number`


``` js
import { lightValue } from 'sunny16';

const lightValue = cameraSettings(2, '1/2000');
```

## Errors

The module will warn when passed invalid data. It throws a `Sunny16Exception` in that case that needs to be `catch`'ed.'
