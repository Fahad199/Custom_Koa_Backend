const sinon = require('sinon');
const assert = require('assert').strict;
const WebsiteSubscriber = require('../../../Controllers/subscriptions');
const [validator, handle] = require('../../../Endpoints/subscriptions/unsubscribe');

const sandbox = sinon.createSandbox();

const endpoint = (ctx) => validator(ctx, () => handle(ctx));

function genBaseRequest() {
  return {
    email: 'fahaddani123@gmail.com',
  };
}

describe('UnSubscribe Email Endpoint', () => {
  afterEach(() => {
    sandbox.restore();
  });

  const email = 'fahaddani123@gmail.com';

  it('Should unsubscribe by the email successfully.', async () => {
    const body = { email };

    const ctx = {
      request: {
        body,
      },
    };

    const message = {
      message: 'You have successfully Un-subscribed to this website',
    };
    const result = {
      dataValues: {
        id: '123132',
      },
    };
    sandbox.stub(WebsiteSubscriber, 'unsubscribeWebsite').resolves(result);

    await endpoint(ctx);
    assert.deepStrictEqual(message, ctx.body);
    sinon.assert.calledOnceWithExactly(WebsiteSubscriber.unsubscribeWebsite, email);
  });

  describe('unsubscribe request validation', () => {
    async function testValidation(body, details) {
      const ctx = {
        request: {
          body,
        },
      };

      await assert.rejects(endpoint(ctx), (err) => {
        assert.strictEqual(err.name, 'ValidationError');
        assert.deepStrictEqual(err.details, details);
        return true;
      });
    }

    it('should validate request body', async () => {
      const body = genBaseRequest();
      body.email = 'asaas';
      await testValidation(body, {
        email: '"email" must be a valid email',
      });
    });
  });
});
