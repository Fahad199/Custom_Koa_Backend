const BaseError = require('../errors/BaseError');
const HttpError = require('../errors/HttpError');

const defaultErrorMap = new Map([
  [
    Error,
    (e, ctx) => {
      ctx.status = 500;
      ctx.body = {
        message: e.message || 'Unknown error',
      };
    },
  ],
  [
    BaseError,
    (e, ctx) => {
      ctx.status = 500;
      ctx.body = {
        message: e.message || 'Unknown application error',
      };
    },
  ],
  [
    HttpError,
    (e, ctx) => {
      ctx.status = e.status;
      if (e.details) {
        ctx.body = {
          message: e.message,
          errors: e.details,
        };
      } else {
        ctx.body = {
          message: e.message,
        };
      }
    },
  ],
]);

module.exports = {
  errorMap: defaultErrorMap,

  getHandlerFor(e) {
    if (this.errorMap.has(e.constructor)) {
      return this.errorMap.get(e.constructor);
    }

    const inheritedHandlers = Array.from(this.errorMap.keys()).filter((key) => e instanceof key);

    if (inheritedHandlers.length > 0) {
      return this.errorMap.get(inheritedHandlers[inheritedHandlers.length - 1]);
    }

    return this.errorMap.get(Error);
  },

  registerHandlers(...errorMaps) {
    errorMaps
      .map(map => [...map])
      .flat()
      .forEach(([key, value]) => this.errorMap.set(key, value));
  },
};
