const joi = require('@hapi/joi');
const { validateRequest } = require('../../middlewares/requestValidator');
const User = require('../../Controllers/user');

const schema = {
  params: {
    id: joi.number().integer().positive().required(),
  },
};

async function handler(ctx) {
  const { id } = ctx.params;

  const response = await User.delete(id);

  if (response) {
    ctx.statusCode = 200;
    ctx.body = { message: 'User deleted successfully' };
  }
}

module.exports = [validateRequest(schema), handler];
