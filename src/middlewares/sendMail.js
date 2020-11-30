const nodemailer = require('nodemailer');
const { generateBody } = require('../email-templates/generateEmailBody');
const { smtpTransport, mailOptions } = require('../constants');
const emailModel = require('../models/email');

module.exports.sendMail = () => async (ctx) => {
  const { fullName, email, mobileNo, query } = ctx.request.body;

  const result = await emailModel.getAllEmails();

  const receivers = [];
  result.map((obj) => receivers.push(obj.dataValues.email));

  const transporter = nodemailer.createTransport(smtpTransport);

  mailOptions.html = generateBody(fullName, email, mobileNo, query);
  mailOptions.to = receivers;

  return transporter
    .sendMail(mailOptions)
    .then((info) => info)
    .catch((err) => err);
};
