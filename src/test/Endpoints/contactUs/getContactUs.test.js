const sinon = require('sinon');
const assert = require('assert').strict;
const ContactUs = require('../../../Controllers/contactUs');
const [validator, handle] = require('../../../Endpoints/contactUs/getContactUs');

const sandbox = sinon.createSandbox();

const endpoint = (ctx) => validator(ctx, () => handle(ctx));

describe('Get ContactUs Endpoint', () => {
  afterEach(() => {
    sandbox.restore();
  });

  const pageNum = 1;
  const pageSize = 1;

  it('Should get the ContactUs successfully.', async () => {
    const query = { pageNum, pageSize };

    const ctx = {
      request: {
        query,
      },
    };

    const response = [
      {
        id: 1,
        fullName: 'arslan fareed',
        email: 'arslanfareed1@gmail.com',
        mobileNo: '12345678911',
        query: 'hello there ! here is arslan from inertiasoft ! i need help',
        createdAt: '2020-09-08T05:44:53.000Z',
      },
    ];

    sandbox.stub(ContactUs, 'get').resolves(response);

    await endpoint(ctx);
    assert.deepStrictEqual(response, ctx.body);
    sinon.assert.calledOnceWithExactly(ContactUs.get, { pageSize, pageNum });
  });

  describe('get request validation', () => {
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

    it('should validate request body', async () => {
      const query = { pageNum, pageSize };
      query.pageNum = 'asas';
      await testValidation(query, {
        pageNum: '"pageNum" must be a number',
      });

      query.pageNum = 1;
      query.pageSize = 'asaas';
      await testValidation(query, {
        pageSize: '"pageSize" must be a number',
      });
    });
  });
});
