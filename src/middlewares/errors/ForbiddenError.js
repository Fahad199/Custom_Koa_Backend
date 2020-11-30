const HttpError = require('./HttpError');

module.exports = class ForbiddenError extends HttpError {
  constructor(message, status = 403) {
    super(status, message);
  }
};
