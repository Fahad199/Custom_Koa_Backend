const joi = require('@hapi/joi');
const { validateRequest } = require('../../middlewares/requestValidator');
const careerForm = require('../../Controllers/careers');

const schema = {
  params: {
    id: joi.number().positive().integer().required(),
  },
};

async function handler(ctx) {
  const { id } = ctx.params;
  const response = await careerForm.getById(id);

  if (response) {
    ctx.statusCode = 200;
    ctx.body = response;
  }
}

module.exports = [validateRequest(schema), handler];
