const joi = require('@hapi/joi');
const { validateRequest } = require('../../middlewares/requestValidator');
const { sendMail } = require('../../middlewares/sendMail');
const contactUs = require('../../Controllers/contactUs');

const schema = {
  body: {
    fullName: joi.string().required(),
    email: joi.string().email().required(),
    mobileNo: joi.string(),
    query: joi.string().required(),
  },
};

async function handler(ctx, next) {
  const { fullName, email, mobileNo, query } = ctx.request.body;

  const response = await contactUs.save({
    fullName,
    email,
    mobileNo,
    query,
  });

  if (response) {
    ctx.statusCode = 201;
    ctx.body = { message: 'ContactUs query saved successfully' };
  }
}

module.exports = [validateRequest(schema), handler, sendMail()];
