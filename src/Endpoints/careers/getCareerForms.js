const joi = require('@hapi/joi');
const { validateRequest } = require('../../middlewares/requestValidator');
const { validationRules } = require('../../constants');
const careerForm = require('../../Controllers/careers');

const schema = {
  query: {
    pageSize: joi.number().positive().integer(),
    pageNum: joi.number().positive().integer(),
    sort: joi.string().optional().valid(...Object.values(validationRules.sort)),
  },
};

async function handler(ctx) {
  const { pageSize, pageNum, sort } = ctx.request.query;

  const response = await careerForm.getCareerForms({ pageSize, pageNum, sort });

  if (response.length > 0) {
    ctx.statusCode = 200;
    ctx.body = response;
  }
}

module.exports = [validateRequest(schema), handler];
