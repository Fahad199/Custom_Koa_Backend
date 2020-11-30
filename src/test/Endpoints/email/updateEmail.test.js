const sinon = require('sinon');
const assert = require('assert').strict;
const Email = require('../../../Controllers/email');
const [validator, handle] = require('../../../Endpoints/email/updateEmail');

const sandbox = sinon.createSandbox();

const endpoint = (ctx) => validator(ctx, () => handle(ctx));

function genBaseRequest() {
  return {
    params: {
      id: 1,
    },
    body: {
      name: 'arslan',
      email: 'arslan121@gmail.com',
    },
  };
}

describe('Update Email Endpoint', () => {
  afterEach(() => {
    sandbox.restore();
  });

  const id = 1;
  const name = 'arslan';
  const email = 'arslan121@gmail.com';

  it('Should update the email successfully.', async () => {
    const params = { id };
    const body = { name, email };

    const ctx = {
      request: {
        body,
      },
      params,
    };

    const message = {
      message: 'Email updated successfully',
    };

    sandbox.stub(Email, 'update').resolves([1]);

    await endpoint(ctx);
    assert.deepStrictEqual(message, ctx.body);
    sinon.assert.calledOnceWithExactly(Email.update, { id, name, email });
  });

  describe('update request validation', () => {
    async function testValidation(params, body, details) {
      const ctx = {
        params,
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
      const { params, body } = genBaseRequest();
      params.id = 'asa';
      await testValidation(params, body, {
        id: '"id" must be a number',
      });

      params.id = genBaseRequest().params.id;
      body.name = 12121;
      await testValidation(params, body, {
        name: '"name" must be a string',
      });

      body.name = genBaseRequest().body.name;
      body.email = 112;
      await testValidation(params, body, {
        email: '"email" must be a string',
      });
    });
  });
});
