const sinon = require('sinon');
const assert = require('assert').strict;
const Email = require('../../../Controllers/email');
const [validator, handle] = require('../../../Endpoints/email/deleteEmail');

const sandbox = sinon.createSandbox();

const endpoint = (ctx) => validator(ctx, () => handle(ctx));

describe('Delete Email Endpoint', () => {
  afterEach(() => {
    sandbox.restore();
  });

  const id = 1;

  it('Should delete the email successfully.', async () => {
    const params = { id };

    const ctx = {
      params,
    };

    const message = {
      message: 'Email deleted successfully',
    };

    sandbox.stub(Email, 'delete').resolves(1);

    await endpoint(ctx);
    assert.deepStrictEqual(message, ctx.body);
    sinon.assert.calledOnceWithExactly(Email.delete, id);
  });

  describe('delete request validation', () => {
    async function testValidation(params, details) {
      const ctx = {
        request: {
          params,
        },
      };

      await assert.rejects(endpoint(ctx), (err) => {
        assert.strictEqual(err.name, 'ValidationError');
        assert.deepStrictEqual(err.details, details);
        return true;
      });
    }

    it('should validate request params', async () => {
      const params = { id };
      params.id = 'asas';
      await testValidation(params, { id: '"id" is required' });
    });
  });
});
