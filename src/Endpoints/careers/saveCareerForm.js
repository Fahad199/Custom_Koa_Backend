const joi = require('@hapi/joi');
const { validateRequest } = require('../../middlewares/requestValidator');
const { sendMail } = require('../../middlewares/sendMail');
const careerForm = require('../../Controllers/careers');

const schema = {
  body: {
    name: joi.string().required(),
    email: joi.string().email().required(),
    description: joi.string().optional(),
    contactNo: joi.string().required(),
    jobTitle: joi.string().required(),
    attachmentId: joi.string().required(),
  },
};

async function handler(ctx, next) {
  const { name, email, description, contactNo, jobTitle, attachmentId } = ctx.request.body;

  const response = await careerForm.save({
    name,
    email,
    description,
    contactNo,
    jobTitle,
    attachmentId,
  });

  if (response) {
    ctx.statusCode = 201;
    ctx.body = { message: 'Career Form saved successfully' };
  }
}

module.exports = [validateRequest(schema), handler, sendMail()];
