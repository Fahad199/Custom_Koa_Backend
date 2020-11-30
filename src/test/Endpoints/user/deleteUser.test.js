const sinon = require('sinon');
const assert = require('assert').strict;
const User = require('../../../Controllers/user');
const [validator, handle] = require('../../../Endpoints/user/deleteUser');

const sandbox = sinon.createSandbox();

const endpoint = (ctx) => validator(ctx, () => handle(ctx));

describe('Delete Email Endpoint', () => {
  afterEach(() => {
    sandbox.restore();
  });

  const id = 1;

  it('Should delete the user successfully.', async () => {
    const params = { id };

    const ctx = {
      params,
    };

    const message = {
      message: 'User deleted successfully',
    };

    sandbox.stub(User, 'delete').resolves(1);

    await endpoint(ctx);
    assert.deepStrictEqual(message, ctx.body);
    sinon.assert.calledOnceWithExactly(User.delete, id);
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
      params.id = 'asaas';
      await testValidation(params, { id: '"id" is required' });
    });
  });
});
