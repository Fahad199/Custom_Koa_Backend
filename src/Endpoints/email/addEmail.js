const joi = require('@hapi/joi');
const { validateRequest } = require('../../middlewares/requestValidator');
const Email = require('../../Controllers/email');

const schema = {
  body: {
    name: joi.string().required(),
    email: joi.string().email().required(),
  },
};

async function handler(ctx) {
  const { name, email } = ctx.request.body;

  const result = await Email.create({
    name,
    email,
  });

  if (result) {
    ctx.statusCode = 200;
    ctx.body = { message: 'Email created successfully' };
  }
}

module.exports = [validateRequest(schema), handler];
