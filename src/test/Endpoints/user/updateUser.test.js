const sinon = require('sinon');
const assert = require('assert').strict;
const User = require('../../../Controllers/user');
const [validator, handle] = require('../../../Endpoints/user/updateUser');
const { validationRules } = require('../../../constants');

const sandbox = sinon.createSandbox();

const endpoint = (ctx) => validator(ctx, () => handle(ctx));

function genBaseRequest() {
  return {
    params: {
      id: 112,
    },
    body: {
      name: 'fahad',
      userName: 'fahad12',
      role: 'Incharge',
    },
  };
}

describe('Update User Endpoint', () => {
  afterEach(() => {
    sandbox.restore();
  });

  const id = 121;
  const name = 'fahad';
  const userName = 'fahda11';
  const role = 'Incharge';

  it('Should update the user successfully.', async () => {
    const params = { id };
    const body = { name, userName, role };

    const ctx = {
      request: {
        body,
      },
      params,
    };

    const message = {
      message: 'User updated successfully',
    };

    sandbox.stub(User, 'update').resolves([1]);

    await endpoint(ctx);
    assert.deepStrictEqual(message, ctx.body);
    sinon.assert.calledOnceWithExactly(User.update, { id, name, userName, role });
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
      params.id = 'asasa';
      await testValidation(params, body, {
        id: '"id" must be a number',
      });

      params.id = genBaseRequest().params.id;
      body.name = 12121;
      await testValidation(params, body, {
        name: '"name" must be a string',
      });

      body.name = genBaseRequest().body.name;
      body.userName = 111;
      await testValidation(params, body, {
        userName: '"userName" must be a string',
      });

      body.userName = genBaseRequest().body.userName;
      body.role = 'ABC';
      await testValidation(params, body, {
        role: `"role" must be one of [${validationRules.roles.join(', ')}]`,
      });
    });
  });
});
