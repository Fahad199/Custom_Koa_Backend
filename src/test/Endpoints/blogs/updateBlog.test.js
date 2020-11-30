const sinon = require('sinon');
const assert = require('assert').strict;
const Blogs = require('../../../Controllers/blogs');
const [validator, handle] = require('../../../Endpoints/blogs/updateBlog');
const { validationRules } = require('../../../constants');

const sandbox = sinon.createSandbox();

const endpoint = (ctx) => validator(ctx, () => handle(ctx));

function genBaseRequest() {
  return {
    params: {
      id: 1,
    },
    body: {
      status: 'Approved',
    },
  };
}

describe('Update Blog Endpoint', () => {
  afterEach(() => {
    sandbox.restore();
  });

  const id = 1;
  const status = 'Approved';

  it('Should update the blog successfully.', async () => {
    const params = { id };
    const body = { status };

    const ctx = {
      request: {
        body,
      },
      params,
    };

    const message = {
      message: 'Blog updated successfully',
    };

    sandbox.stub(Blogs, 'update').resolves([1]);

    await endpoint(ctx);
    assert.deepStrictEqual(message, ctx.body);
    sinon.assert.calledOnceWithExactly(Blogs.update, id, status);
  });

  describe('update request validation', () => {
    async function testValidation(params, body, details) {
      const ctx = {
        request: {
          body,
        },
        params,
      };

      await assert.rejects(endpoint(ctx), (err) => {
        assert.strictEqual(err.name, 'ValidationError');
        assert.deepStrictEqual(err.details, details);
        return true;
      });
    }

    it('should validate request body and params', async () => {
      const { params, body } = genBaseRequest();
      params.id = 'asasa';
      await testValidation(params, body, { id: '"id" must be a number' });

      params.id = 1;
      body.status = 'asaas';
      await testValidation(params, body, {
        status: `"status" must be [Approved]`,
      });
    });
  });
});
