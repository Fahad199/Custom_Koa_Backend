const joi = require('@hapi/joi');
const { validateRequest } = require('../../middlewares/requestValidator');
const blogs = require('../../Controllers/blogs');

const schema = {
  params: {
    id: joi.number().required(),
  },
};

async function handler(ctx) {
  const { id } = ctx.params;
  const result = await blogs.deleteBlog(id);
  if (result) {
    ctx.statusCode = 200;
    ctx.body = { message: 'Blog deleted successfully' };
  }
}

module.exports = [validateRequest(schema), handler];
