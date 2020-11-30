const sinon = require('sinon');
const assert = require('assert').strict;
const Email = require('../../../Controllers/email');
const [validator, handle] = require('../../../Endpoints/email/getEmails');

const sandbox = sinon.createSandbox();

const endpoint = (ctx) => validator(ctx, () => handle(ctx));

describe('Get Emails Endpoint', () => {
  afterEach(() => {
    sandbox.restore();
  });

  const pageNum = 1;
  const pageSize = 1;

  it('Should get the emails successfully.', async () => {
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

    sandbox.stub(Email, 'getEmails').resolves(response);

    await endpoint(ctx);
    assert.deepStrictEqual(response, ctx.body);
    sinon.assert.calledOnceWithExactly(Email.getEmails, { pageNum, pageSize });
  });

  describe('get emails request validation', () => {
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
      query.pageSize = 'asasasa';
      await testValidation(query, { pageSize: '"pageSize" must be a number' });

      query.pageSize = 1;
      query.pageNum = 'asasas';
      await testValidation(query, { pageNum: '"pageNum" must be a number' });
    });
  });
});
