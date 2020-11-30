module.exports = class BaseError extends Error {
  constructor(message) {
    if (new.target === BaseError) {
      throw new BaseError('Cannot construct BaseError instances directly');
    }
    super(message);

    this.name = this.constructor.name;

    if (typeof Error.captureStackTrace === 'function') {
      Error.captureStackTrace(this, this.constructor);
    } else {
      this.stack = new Error(message).stack;
    }
  }
};
