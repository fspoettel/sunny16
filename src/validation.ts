/** Checks if a value is numeric */
interface isNumericI {
  (n: any): boolean;
}

export const isNumeric: isNumericI = function (n) {
  return !isNaN(parseFloat(n)) && isFinite(n);
};

/** Checks if a value is a string */

interface isStringI {
  (s: any): boolean;
}

export const isString: isStringI = function (s) {
  return typeof s === 'string' || s instanceof String;
};

/** Validates a number argument */
interface validateNumberI {
  (value: any, required?: boolean): boolean;
}

export const validateNumber: validateNumberI = function (value, required = true) {
  const emptyValue = value === null || value === undefined;

  if (emptyValue && required) { return false; }
  if (emptyValue && !required) { return true; }

  return isNumeric(value);
};

/** Validates a string argument */
interface validateStringI {
  (value: any, required?: boolean): boolean;
}

export const validateString: validateStringI = function (value, required = true) {
  const emptyValue = value === null || value === undefined;

  if (emptyValue && required) { return false; }
  if (emptyValue && !required) { return true; }

  return isString(value);
};

/** Validates the config argument */
interface validateConfigI {
  (config: any): boolean;
}

export const validateConfig: validateConfigI = function (config = {}) {
  const { fNumbers, shutterSpeeds } = config;

  if (fNumbers && !Array.isArray(fNumbers)) { return false; }
  if (shutterSpeeds && !Array.isArray(shutterSpeeds)) { return false; }

  return true;
};

export class Sunny16Exception implements Error {
  name: string;
  message: string;
  stack: string | undefined;

  constructor(message: string) {
    this.name = 'Sunny16';
    this.message = message;
    this.stack = new Error().stack;
  }
}

Sunny16Exception.prototype = Object.create(Error.prototype);
