const dotenv = require('dotenv');

dotenv.config();

module.exports.config = {
  host: process.env.DB_HOST,
  database: process.env.DATABASE,
  user: process.env.USER,
  dialect: process.env.DIALECT,
  BASE_URL: process.env.BASE_URL,
  PORT: process.env.PORT,
};

module.exports.mailOptions = {
  from: process.env.MAIL_FROM,
  subject: 'New contact Request',
};

module.exports.smtpTransport = {
  host: 'smtp.ionos.com',
  auth: {
    user: process.env.MAIL_FROM,
    pass: process.env.PASSWORD,
  },
};

module.exports.validationRules = {
  contentTypeMultipartRegExp: /^multipart\/form-data;.*$/,
  blogStatus: ['Pending', 'Approved'],
  roles: ['Admin', 'Editor', 'Incharge'],
  sort: [ 'ASC', 'DESC'],
};
