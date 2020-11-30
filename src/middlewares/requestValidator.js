const Joi = require('@hapi/joi');
const ValidationError = require('./errors/ValidationError');

module.exports.validateRequest = (schema) => {
  return async (ctx, next) => {
    ctx.validated = {};

    if (schema.headers) {
      const { value, error } = Joi.object(schema.headers)
        .unknown()
        .label('request.headers')
        .validate(ctx.request.headers || {});

      if (error) {
        throw new ValidationError('Invalid request headers', error.details);
      }

      ctx.validated.headers = value;
    }

    if (schema.params) {
      const { value, error } = Joi.object(schema.params)
        .label('request.params')
        .validate(ctx.params || {} || '');
      if (error) {
        throw new ValidationError('Invalid request url params', error.details);
      }

      ctx.validated.params = value;
    }

    if (schema.query) {
      const { value, error } = Joi.object(schema.query)
        .label('request.query')
        .validate(ctx.request.query || {});
      if (error) {
        throw new ValidationError('Invalid request query params', error.details);
      }

      ctx.validated.query = value;
    }

    if (schema.body) {
      const { value, error } = Joi.object(schema.body)
        .label('request.body')
        .validate(ctx.request.body || {});
      if (error) {
        throw new ValidationError('Invalid request body params', error.details);
      }

      ctx.validated.body = value;
    }

    await next(ctx);
  };
};
