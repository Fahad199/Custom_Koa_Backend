const sinon = require('sinon');
const assert = require('assert').strict;
const User = require('../../../Controllers/user');
const [validator, handle] = require('../../../Endpoints/user/createUser');
const { validationRules } = require('../../../constants');

const sandbox = sinon.createSandbox();

const endpoint = (ctx) => validator(ctx, () => handle(ctx));

function genBaseRequest() {
  return {
    name: 'fahad',
    userName: 'fahad1212',
    password: 'test123',
    role: 'Admin',
  };
}

describe('Create User Endpoint', () => {
  afterEach(() => {
    sandbox.restore();
  });

  const name = 'fahad';
  const userName = 'fahad1212';
  const password = 'test123';
  const role = 'Admin';

  it('Should create the user successfully.', async () => {
    const body = { name, userName, password, role };

    const ctx = {
      request: {
        body,
      },
    };

    const message = {
      message: 'User created successfully',
    };
    const result = {
      dataValues: {
        id: '123132',
      },
    };
    sandbox.stub(User, 'create').resolves(result);

    await endpoint(ctx);
    assert.deepStrictEqual(message, ctx.body);
    sinon.assert.calledOnceWithExactly(User.create, { name, userName, password, role });
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
      body.userName = 1212;
      await testValidation(body, {
        userName: '"userName" must be a string',
      });

      body.userName = genBaseRequest().userName;
      body.password = 1212;
      await testValidation(body, {
        password: '"password" must be a string',
      });

      body.password = genBaseRequest().password;
      body.role = 1212;
      await testValidation(body, {
        role: `"role" must be one of [${validationRules.roles.join(', ')}]`,
      });
    });
  });
});
