module.exports = function handleErrors(errorHandler) {
  return async (ctx, next) => {
    try {
      await next(ctx);
    } catch (e) {
      const handler = errorHandler.getHandlerFor(e);
      handler(e, ctx);
      ctx.app.emit('error', e, ctx);
    }
  };
};
