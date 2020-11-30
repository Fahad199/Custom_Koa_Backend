const sinon = require('sinon');
const assert = require('assert').strict;
const ContactUs = require('../../../Controllers/contactUs');
const [validator, handle] = require('../../../Endpoints/contactUs/saveContactUs');

const sandbox = sinon.createSandbox();

const endpoint = (ctx) => validator(ctx, () => handle(ctx));

function genBaseRequest() {
  return {
    fullName: 'arslan',
    email: 'arslan121@gmail.com',
    mobileNo: '03331234569',
    query: 'Hello World',
  };
}

describe('Create ContactUs Endpoint', () => {
  afterEach(() => {
    sandbox.restore();
  });

  const fullName = 'arslan';
  const email = 'arslan121@gmail.com';
  const mobileNo = '03331234569';
  const query = 'Helo World';

  it('Should create the ContactUs successfully.', async () => {
    const body = { fullName, email, mobileNo, query };

    const ctx = {
      request: {
        body,
      },
    };

    const message = {
      message: 'ContactUs query saved successfully',
    };
    const result = {
      dataValues: {
        id: '123132',
      },
    };
    sandbox.stub(ContactUs, 'save').resolves(result);

    await endpoint(ctx);
    assert.deepStrictEqual(message, ctx.body);
    sinon.assert.calledOnceWithExactly(ContactUs.save, { fullName, email, mobileNo, query });
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
      body.fullName = 12121;
      await testValidation(body, {
        fullName: '"fullName" must be a string',
      });

      body.fullName = genBaseRequest().fullName;
      body.email = 'asaas';
      await testValidation(body, {
        email: '"email" must be a valid email',
      });

      body.email = genBaseRequest().email;
      body.mobileNo = 12121;
      await testValidation(body, {
        mobileNo: '"mobileNo" must be a string',
      });

      body.mobileNo = genBaseRequest().mobileNo;
      body.query = 12121;
      await testValidation(body, {
        query: '"query" must be a string',
      });
    });
  });
});
