const joi = require('@hapi/joi');
const { validateRequest } = require('../../middlewares/requestValidator');
const User = require('../../Controllers/user');
const { validationRules } = require('../../constants');

const schema = {
  body: {
    name: joi.string().required(),
    userName: joi.string().required(),
    password: joi.string().required(),
    role: joi
      .string()
      .valid(...Object.values(validationRules.roles))
      .required(),
  },
};

async function handler(ctx) {
  const { name, userName, password, role } = ctx.request.body;

  const result = await User.create({
    name,
    userName,
    password,
    role,
  });

  if (result) {
    ctx.statusCode = 201;
    ctx.body = { message: 'User created successfully' };
  }
}

module.exports = [validateRequest(schema), handler];
