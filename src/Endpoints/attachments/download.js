const joi = require('@hapi/joi');
const { validateRequest } = require('../../middlewares/requestValidator');
const Attachment = require('../../Controllers/attachment');

const schema = {
  params: {
    id: joi.number().integer().positive().required(),
  },
};

async function handler(ctx) {
  const { id } = ctx.params;

  const { file, mimeType } = await Attachment.download(id, ctx);
  ctx.set('Content-Type', mimeType);
  ctx.body = file;
}

module.exports = [validateRequest(schema), handler];
