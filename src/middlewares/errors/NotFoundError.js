const HttpError = require('./HttpError');

module.exports = class NotFoundError extends HttpError {
  constructor(message, status = 404) {
    super(status, message);
  }
};
