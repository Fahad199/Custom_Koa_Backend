const joi = require('@hapi/joi');
const { validateRequest } = require('../../middlewares/requestValidator');
const User = require('../../Controllers/user');

const schema = {
  query: {
    pageSize: joi.number().positive().integer(),
    pageNum: joi.number().positive().integer(),
  },
};

async function handler(ctx) {
  const { pageSize, pageNum } = ctx.request.query;

  const response = await User.getUsers({ pageSize, pageNum });

  if (response.length > 0) {
    ctx.statusCode = 200;
    ctx.body = response;
  }
}

module.exports = [validateRequest(schema), handler];
