const sinon = require('sinon');
const assert = require('assert').strict;
const Email = require('../../../Controllers/email');
const [validator, handle] = require('../../../Endpoints/email/addEmail');

const sandbox = sinon.createSandbox();

const endpoint = (ctx) => validator(ctx, () => handle(ctx));

function genBaseRequest() {
  return {
    name: 'arslan',
    email: 'arslan121@gmail.com',
  };
}

describe('Create Email Endpoint', () => {
  afterEach(() => {
    sandbox.restore();
  });

  const name = 'arslan';
  const email = 'arslan121@gmail.com';

  it('Should create the Email successfully.', async () => {
    const body = { name, email };

    const ctx = {
      request: {
        body,
      },
    };

    const message = {
      message: 'Email created successfully',
    };
    const result = {
      dataValues: {
        id: '123132',
      },
    };
    sandbox.stub(Email, 'create').resolves(result);

    await endpoint(ctx);
    assert.deepStrictEqual(message, ctx.body);
    sinon.assert.calledOnceWithExactly(Email.create, { name, email });
  });

  describe('create request validation', () => {
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
      body.name = 12121;
      await testValidation(body, {
        name: '"name" must be a string',
      });

      body.name = genBaseRequest().name;
      body.email = 'asaas';
      await testValidation(body, {
        email: '"email" must be a valid email',
      });
    });
  });
});
