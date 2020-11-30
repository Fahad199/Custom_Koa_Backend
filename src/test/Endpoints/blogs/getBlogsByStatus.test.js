const sinon = require('sinon');
const assert = require('assert').strict;
const Blogs = require('../../../Controllers/blogs');
const [validator, handle] = require('../../../Endpoints/blogs/getBlogsByStatus');
const { validationRules } = require('../../../constants');

const sandbox = sinon.createSandbox();

const endpoint = (ctx) => validator(ctx, () => handle(ctx));

describe('Get Blogs by status Endpoint', () => {
  afterEach(() => {
    sandbox.restore();
  });

  const pageSize = 1;
  const pageNum = 1;
  const status = 'Approved';

  it('Should get the blogs of pending status successfully.', async () => {
    const pageSize = 1;
    const pageNum = 1;
    const status = 'Pending';
    const query = { pageSize, pageNum, status };

    const ctx = {
      request: {
        query,
      },
    };

    const response = [
      {
        id: 12,
        title: 'myBlog',
        description: 'here is my first blog',
        fullName: 'arslan',
        email: 'arslan121@gmail.com',
        contactNo: '3331234569',
        status: 'Pending',
        createdAt: '2020-09-28T10:37:45.000Z',
        images: [
          {
            id: '4',
            url: 'http://192.168.0.116:5000/download/4',
          },
        ],
      },
    ];

    sandbox.stub(Blogs, 'getBlogsByStatus').resolves(response);

    await endpoint(ctx);
    assert.deepStrictEqual(response, ctx.body);
    sinon.assert.calledOnceWithExactly(Blogs.getBlogsByStatus, { pageSize, pageNum, status });
  });

  it('Should get the blogs of approved status successfully.', async () => {
    const pageSize = 1;
    const pageNum = 1;
    const status = 'Approved';
    const query = { pageSize, pageNum, status };

    const ctx = {
      request: {
        query,
      },
    };

    const response = [
      {
        id: 12,
        title: 'myBlog',
        description: 'here is my first blog',
        fullName: 'arslan',
        email: 'arslan121@gmail.com',
        contactNo: '3331234569',
        status: 'Approved',
        createdAt: '2020-09-28T10:37:45.000Z',
        images: [
          {
            id: '4',
            url: 'http://192.168.0.116:5000/download/4',
          },
        ],
      },
    ];

    sandbox.stub(Blogs, 'getBlogsByStatus').resolves(response);

    await endpoint(ctx);
    assert.deepStrictEqual(response, ctx.body);
    sinon.assert.calledOnceWithExactly(Blogs.getBlogsByStatus, { pageSize, pageNum, status });
  });

  describe('get blogs by status request validation', () => {
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
      const query = { pageSize, pageNum, status };
      query.pageSize = 'asaas';
      await testValidation(query, { pageSize: '"pageSize" must be a number' });

      query.pageSize = 1;
      query.pageNum = 'asas';
      await testValidation(query, { pageNum: '"pageNum" must be a number' });

      query.pageNum = 1;
      query.status = 'asasa';
      await testValidation(query, { status: `"status" must be one of [${validationRules.blogStatus.join(', ')}]` });
    });
  });
});
