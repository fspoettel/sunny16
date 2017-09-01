/** Checks if a value is numeric */
function isNumeric(n: any): boolean {
  return !isNaN(parseFloat(n)) && isFinite(n);
}

/** Checks if a value is a string */
function isString(s: any): boolean {
  return typeof s === 'string' || s instanceof String;
}

/** Validates a number argument */
export function validateNumber(value: any, required = true): boolean {
  const emptyValue = value === null || value === undefined;

  if (emptyValue && required) { return false; }
  if (emptyValue && !required) { return true; }

  return isNumeric(value);
}

/** Validates a string argument */
interface validateStringI {
  (value: any, required?: boolean): boolean;
}

export function validateString(value: any, required = true): boolean {
  const emptyValue = value === null || value === undefined;

  if (emptyValue && required) { return false; }
  if (emptyValue && !required) { return true; }

  return isString(value);
}

/** Validates the config argument */
export function validateConfig(config?: configI): boolean {
  if (!config) { return true; }

  const { fNumbers, shutterSpeeds } = config;

  if (fNumbers && !Array.isArray(fNumbers)) { return false; }
  if (shutterSpeeds && !Array.isArray(shutterSpeeds)) { return false; }

  return true;
}

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
