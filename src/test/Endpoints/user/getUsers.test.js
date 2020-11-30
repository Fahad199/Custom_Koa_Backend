const sinon = require('sinon');
const assert = require('assert').strict;
const User = require('../../../Controllers/user');
const [validator, handle] = require('../../../Endpoints/user/getUsers');

const sandbox = sinon.createSandbox();

const endpoint = (ctx) => validator(ctx, () => handle(ctx));

describe('Get Users Endpoint', () => {
  afterEach(() => {
    sandbox.restore();
  });

  const pageNum = 1;
  const pageSize = 1;

  it('Should get the users successfully', async () => {
    const query = { pageNum, pageSize };

    const ctx = {
      request: {
        query,
      },
    };

    const response = [
      {
        id: 1,
        name: 'fahad',
        email: 'fahad.saleem@inertiasoft.net',
      },
    ];

    sandbox.stub(User, 'getUsers').resolves(response);

    await endpoint(ctx);
    assert.deepStrictEqual(response, ctx.body);
    sinon.assert.calledOnceWithExactly(User.getUsers, { pageNum, pageSize });
  });

  describe('get users request validation', () => {
    async function testValidation(query, details) {
      const ctx = {
        request: {
          query,
        },
      };

      await assert.rejects(endpoint(ctx), (err) => {
        assert.strictEqual(err.name, 'ValidationError');
        assert.deepStrictEqual(err.details, details);
        return true;
      });
    }

    it('should validate request query params', async () => {
      const query = { pageSize, pageNum };
      query.pageSize = 'asasa';
      await testValidation(query, { pageSize: '"pageSize" must be a number' });

      query.pageSize = 1;
      query.pageNum = 'asasas';
      await testValidation(query, { pageNum: '"pageNum" must be a number' });
    });
  });
});
