const sinon = require('sinon');
const assert = require('assert').strict;
const Blogs = require('../../../Controllers/blogs');
const [validator, handle] = require('../../../Endpoints/blogs/getBlogById');

const sandbox = sinon.createSandbox();

const endpoint = (ctx) => validator(ctx, () => handle(ctx));

describe('Get Blog by Id Endpoint', () => {
  afterEach(() => {
    sandbox.restore();
  });

  const id = 1;

  it('Should get the blog by id successfully.', async () => {
    const params = { id };

    const ctx = {
      params,
    };

    const response = {
      id: 12,
      title: 'myBlog',
      description: 'here is my first blog',
      fullName: 'arslan',
      email: 'arslan121@gmail.com',
      contactNo: '3331234569',
      createdAt: '2020-09-28T10:37:45.000Z',
      images: [
        {
          id: '4',
          url: 'http://192.168.0.116:5000/download/4',
        },
      ],
    };

    sandbox.stub(Blogs, 'getBlogById').resolves(response);

    await endpoint(ctx);
    assert.deepStrictEqual(response, ctx.body);
    sinon.assert.calledOnceWithExactly(Blogs.getBlogById, id);
  });

  describe('get blog by id request validation', () => {
    async function testValidation(params, details) {
      const ctx = {
        params,
      };

      await assert.rejects(endpoint(ctx.params), (err) => {
        assert.strictEqual(err.name, 'ValidationError');
        assert.deepStrictEqual(err.details, details);
        return true;
      });
    }

    it('should validate request params', async () => {
      const params = { id };
      params.id = 'saasa';
      await testValidation(params, { id: '"id" is required' });
    });
  });
});
