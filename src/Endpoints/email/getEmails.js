const joi = require('@hapi/joi');
const { validateRequest } = require('../../middlewares/requestValidator');
const Email = require('../../Controllers/email');

const schema = {
  query: {
    pageSize: joi.number().positive().integer(),
    pageNum: joi.number().positive().integer(),
  },
};

async function handler(ctx) {
  const { pageSize, pageNum } = ctx.request.query;
  const response = await Email.getEmails({ pageNum, pageSize });
  if (response.length > 0) {
    ctx.statusCode = 200;
    ctx.body = response;
  }
}

module.exports = [validateRequest(schema), handler];
