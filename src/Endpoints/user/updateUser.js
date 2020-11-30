const joi = require('@hapi/joi');
const { validateRequest } = require('../../middlewares/requestValidator');
const { validationRules } = require('../../constants');
const User = require('../../Controllers/user');

const schema = {
  params: {
    id: joi.number().integer().positive().required(),
  },
  body: {
    name: joi.string().required(),
    userName: joi.string().required(),
    role: joi
      .string()
      .valid(...Object.values(validationRules.roles))
      .required(),
  },
};

async function handler(ctx) {
  const { id } = ctx.params;

  const { name, userName, role } = ctx.request.body;

  const result = await User.update({
    id,
    name,
    userName,
    role,
  });

  if (result[0]) {
    ctx.statusCode = 200;
    ctx.body = { message: 'User updated successfully' };
  }
}

module.exports = [validateRequest(schema), handler];
