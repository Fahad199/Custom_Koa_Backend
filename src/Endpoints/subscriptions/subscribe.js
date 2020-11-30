const joi = require('@hapi/joi');
const { validateRequest } = require('../../middlewares/requestValidator');
const WebsiteSubscriber = require('../../Controllers/subscriptions');

const schema = {
  body: {
    email: joi.string().email().required(),
  },
};

async function handler(ctx) {
  const { email } = ctx.request.body;

  const result = await WebsiteSubscriber.subscribeWebsite(email);

  if (result) {
    ctx.statusCode = 200;
    ctx.body = { message: 'Thank you, you have successfully subscribed to this website' };
  }
}

module.exports = [validateRequest(schema), handler];
