const joi = require('@hapi/joi');
const { validateRequest } = require('../../middlewares/requestValidator');
const Email = require('../../Controllers/email');

const schema = {
  params: {
    id: joi.number().integer().positive().required(),
  },
};

async function handler(ctx) {
  const { id } = ctx.params;

  const response = await Email.delete(id);

  if (response) {
    ctx.statusCode = 200;
    ctx.body = { message: 'Email deleted successfully' };
  }
}

module.exports = [validateRequest(schema), handler];
