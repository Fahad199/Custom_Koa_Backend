const sinon = require('sinon');
const assert = require('assert').strict;
const Blogs = require('../../../Controllers/blogs');
const [validator, handle] = require('../../../Endpoints/blogs/createBlog');

const sandbox = sinon.createSandbox();

const endpoint = (ctx) => validator(ctx, () => handle(ctx));

function genBaseRequest() {
  return {
    title: 'myBlog',
    description: 'here is my first blog',
    fullName: 'arslan',
    email: 'arslan121@gmail.com',
    contactNo: '03331234569',
    status: 'Pending',
    imageId: 4,
  };
}

describe('Create Blog Endpoint', () => {
  afterEach(() => {
    sandbox.restore();
  });

  const title = 'myBlog';
  const description = 'here is my first blog';
  const fullName = 'arslan';
  const email = 'arslan121@gmail.com';
  const contactNo = '03331234569';
  const imageId = 4;

  it('Should create the blog successfully.', async () => {
    const body = { title, description, fullName, email, contactNo, imageId };

    const ctx = {
      request: {
        body,
      },
    };

    const message = {
      message: 'Blog created successfully',
    };
    const result = {
      dataValues: {
        id: '123132',
      },
    };
    sandbox.stub(Blogs, 'create').resolves(result);

    await endpoint(ctx);
    assert.deepStrictEqual(message, ctx.body);
    sinon.assert.calledOnceWithExactly(Blogs.create, {
      title,
      description,
      fullName,
      email,
      contactNo,
      imageId,
    });
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
      body.title = 121;
      await testValidation(body, { title: '"title" must be a string' });

      body.title = genBaseRequest().title;
      body.description = 1212;
      await testValidation(body, { description: '"description" must be a string' });

      body.description = genBaseRequest().description;
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
      body.contactNo = 12121;
      await testValidation(body, {
        contactNo: '"contactNo" must be a string',
      });

      body.contactNo = genBaseRequest().contactNo;
      body.imageId = 'asas';
      await testValidation(body, {
        imageId: '"imageId" must be a number',
      });
    });
  });
});
