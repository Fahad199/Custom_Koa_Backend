const joi = require('@hapi/joi');
const { validateRequest } = require('../../middlewares/requestValidator');
const blogs = require('../../Controllers/blogs');

const schema = {
  params: {
    id: joi.number().positive().integer().required(),
  },
};

async function handler(ctx) {
  const { id } = ctx.params;
  const response = await blogs.getBlogById(id);

  if (response) {
    ctx.statusCode = 200;
    ctx.body = response;
  }
}

module.exports = [validateRequest(schema), handler];
