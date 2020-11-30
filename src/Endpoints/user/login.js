const joi = require('@hapi/joi');
const { validateRequest } = require('../../middlewares/requestValidator');
const User = require('../../Controllers/user');

const schema = {
  body: {
    userName: joi.string().required(),
    password: joi.string().required(),
  },
};

async function handler(ctx) {
  const { userName, password } = ctx.request.body;

  const response = await User.getUser({ userName, password });

  if (response) {
    ctx.statusCode = 200;
    ctx.body = response;
  }
}

module.exports = [validateRequest(schema), handler];
