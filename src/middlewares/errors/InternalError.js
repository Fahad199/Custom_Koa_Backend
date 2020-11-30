const HttpError = require('./HttpError');

module.exports = class InternalError extends HttpError {
  constructor(message, status = 500) {
    super(status, message);
  }
};
