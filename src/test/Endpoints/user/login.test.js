const sinon = require('sinon');
const assert = require('assert').strict;
const User = require('../../../Controllers/user');
const [validator, handle] = require('../../../Endpoints/user/login');

const sandbox = sinon.createSandbox();

const endpoint = (ctx) => validator(ctx, () => handle(ctx));

function genBaseRequest() {
  return {
    userName: 'fahad12',
    password: 'test123',
  };
}

describe('Get User Endpoint', () => {
  afterEach(() => {
    sandbox.restore();
  });

  const userName = 'fahad12';
  const password = 'test123';

  it('Should get the user by id and login successfully.', async () => {
    const body = { userName, password };

    const ctx = {
      request: {
        body,
      },
    };

    const response = {
      id: '3',
      name: 'fahad saleem',
      userName: 'fahad.saleem',
      password: 'fahad1234',
      role: 'Admin',
    };

    sandbox.stub(User, 'getUser').resolves(response);

    await endpoint(ctx);
    assert.deepStrictEqual(response, ctx.body);
    sinon.assert.calledOnceWithExactly(User.getUser, { userName, password });
  });

  describe('get user by id request validation', () => {
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
      body.userName = 121;
      await testValidation(body, { userName: '"userName" must be a string' });

      body.userName = genBaseRequest().userName;
      body.password = 121;
      await testValidation(body, { password: '"password" must be a string' });
    });
  });
});
