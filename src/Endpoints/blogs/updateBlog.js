const joi = require('@hapi/joi');
const { validateRequest } = require('../../middlewares/requestValidator');
const blogs = require('../../Controllers/blogs');
const { validationRules } = require('../../constants');

const schema = {
  params: {
    id: joi.number().positive().integer().required(),
  },
  body: {
    status: joi
      .string()
      .valid(validationRules.blogStatus[1])
      .required(),
  },
};

async function handler(ctx) {
  const { id } = ctx.params;
  const { status } = ctx.request.body;
  const result = await blogs.update(id, status);
  if (result[0]) {
    ctx.statusCode = 200;
    ctx.body = { message: 'Blog updated successfully' };
  }
}

module.exports = [validateRequest(schema), handler];
