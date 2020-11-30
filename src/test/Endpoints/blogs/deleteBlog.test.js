const sinon = require('sinon');
const assert = require('assert').strict;
const Blogs = require('../../../Controllers/blogs');
const [validator, handle] = require('../../../Endpoints/blogs/deleteBlog');

const sandbox = sinon.createSandbox();

const endpoint = (ctx) => validator(ctx, () => handle(ctx));

describe('Delete Blog Endpoint', () => {
  afterEach(() => {
    sandbox.restore();
  });

  const id = 1;

  it('Should delete the blog successfully.', async () => {
    const params = { id };

    const ctx = {
      params,
    };

    const message = {
      message: 'Blog deleted successfully',
    };

    sandbox.stub(Blogs, 'deleteBlog').resolves(1);

    await endpoint(ctx);
    assert.deepStrictEqual(message, ctx.body);
    sinon.assert.calledOnceWithExactly(Blogs.deleteBlog, id);
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
      params.id = 'asasa';
      await testValidation(params, { id: '"id" is required' });
    });
  });
});
