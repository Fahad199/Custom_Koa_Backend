const HttpError = require('./HttpError');

module.exports = class ValidationError extends HttpError {
  constructor(messageOrDetails, details) {
    if (Array.isArray(details)) {
      super(400, messageOrDetails);
      this.details = details;
    } else if (Array.isArray(messageOrDetails)) {
      super(400);
      this.details = messageOrDetails;
    } else {
      super(400, messageOrDetails);
    }

    if (this.details) {
      this.details = this.details.reduce((acc, error) => ({ ...acc, [error.path]: error.message }), {});
    }
  }
};
