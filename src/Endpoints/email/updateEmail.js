const joi = require('@hapi/joi');
const { validateRequest } = require('../../middlewares/requestValidator');
const Email = require('../../Controllers/email');

const schema = {
  params: {
    id: joi.number().integer().positive().required(),
  },
  body: {
    name: joi.string(),
    email: joi.string(),
  },
};

async function handler(ctx) {
  const { id } = ctx.params;

  const { name, email } = ctx.request.body;

  const result = await Email.update({
    id,
    name,
    email,
  });

  if (result[0]) {
    ctx.statusCode = 200;
    ctx.body = { message: 'Email updated successfully' };
  }
}

module.exports = [validateRequest(schema), handler];
