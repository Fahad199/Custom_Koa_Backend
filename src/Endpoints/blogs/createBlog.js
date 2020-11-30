const joi = require('@hapi/joi');
const { validateRequest } = require('../../middlewares/requestValidator');
const blogs = require('../../Controllers/blogs');
const { validationRules } = require('../../constants');

const schema = {
  body: {
    title: joi.string().required(),
    description: joi.string().required(),
    fullName: joi.string().required(),
    email: joi.string().email().required(),
    contactNo: joi.string().min(11).max(11).required(),
    imageId: joi.number().integer().positive().required(),
  },
};

async function handler(ctx) {
  const { title, description, fullName, email, contactNo, imageId } = ctx.request.body;

  const result = await blogs.create({ title, description, fullName, email, contactNo, imageId });

  if (result.dataValues) {
    ctx.statusCode = 201;
    ctx.body = { message: 'Blog created successfully' };
  }
}

module.exports = [validateRequest(schema), handler];
