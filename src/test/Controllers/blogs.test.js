const assert = require('assert').strict;
const sinon = require('sinon');
const { validationRules } = require('../../constants');

const BlogController = require('../../Controllers/blogs');
const BlogModel = require('../../models/blogs');
const BlogImageModel = require('../../models/blogsImage');
const AttachmentModel = require('../../models/attachments');

const sandbox = sinon.createSandbox();

const createResponse = {
  dataValues: {
    id: 55,
    title: 'asas',
    description: 'abc',
    fullName: 'arslan',
    email: 'abc@gmail.com',
    contactNo: '03133380676',
    status: 'Pending',
    updatedAt: '2020-10-01T07:34:40.677Z',
    createdAt: '2020-10-01T07:34:40.677Z',
  },
  _previousDataValues: {
    title: 'asas',
    description: 'abc',
    fullName: 'arslan',
    email: 'abc@gmail.com',
    contactNo: '03133380676',
    status: 'Pending',
    id: 55,
    createdAt: '2020-10-01T07:34:40.677Z',
    updatedAt: '2020-10-01T07:34:40.677Z',
  },
  _changed: { Set: {} },
  _options: {
    isNewRecord: true,
    _schema: null,
    _schemaDelimiter: '',
    attributes: undefined,
    include: undefined,
    raw: undefined,
    silent: undefined,
  },
  isNewRecord: false,
};

const getResponse = {
  dataValues: {
    id: 12,
    title: 'myBlog',
    description: 'here is my first blog',
    fullName: 'arslan',
    email: 'arslan121@gmail.com',
    contactNo: 3331234569,
    status: 'Pending',
    createdAt: '2020-09-28T10:37:45.000Z',
  },
  _previousDataValues: {
    id: 12,
    title: 'myBlog',
    description: 'here is my first blog',
    fullName: 'arslan',
    email: 'arslan121@gmail.com',
    contactNo: 3331234569,
    status: 'Pending',
    createdAt: '2020-09-28T10:37:45.000Z',
  },
  _changed: { Set: {} },
  _options: {
    isNewRecord: false,
    _schema: null,
    _schemaDelimiter: '',
    raw: true,
    attributes: [Array],
  },
  isNewRecord: false,
};

const getImageResponse = {
  dataValues: {
    id: 12,
    blogId: 12,
    imageId: 4,
    createdAt: '2020-09-28T10:37:46.000Z',
    updatedAt: '2020-09-28T10:37:46.000Z',
  },
  _previousDataValues: {
    id: 12,
    blogId: 12,
    imageId: 4,
    createdAt: '2020-09-28T10:37:46.000Z',
    updatedAt: '2020-09-28T10:37:46.000Z',
  },
  _changed: { Set: {} },
  _options: {
    isNewRecord: false,
    _schema: null,
    _schemaDelimiter: '',
    raw: true,
    attributes: [Array],
  },
  isNewRecord: false,
};

const imageResponse = {
  dataValues: {
    id: 55,
    blogId: 55,
    imageId: 4,
    updatedAt: '2020-10-01T09:39:02.962Z',
    createdAt: '2020-10-01T09:39:02.962Z',
  },
  _previousDataValues: {
    blogId: 55,
    imageId: 4,
    id: 55,
    createdAt: '2020-10-01T09:39:02.962Z',
    updatedAt: '2020-10-01T09:39:02.962Z',
  },
  _changed: { Set: {} },
  _options: {
    isNewRecord: true,
    _schema: null,
    _schemaDelimiter: '',
    attributes: undefined,
    include: undefined,
    raw: undefined,
    silent: undefined,
  },
  isNewRecord: false,
};

const blogParams = {
  title: 'asas',
  description: 'abc',
  fullName: 'arslan',
  email: 'abc@gmail.com',
  contactNo: '03133380676',
  imageId: 4,
};

describe('Blog Controller', () => {
  afterEach(() => {
    sandbox.restore();
  });

  it('should create a blog successfully', async () => {
    const stubBlogCreate = sandbox.stub(BlogModel, 'create').resolves(createResponse);
    const stubBlogImageCreate = sandbox.stub(BlogImageModel, 'create').resolves(imageResponse);
    const blog = await BlogController.create(blogParams);

    sinon.assert.calledOnceWithExactly(stubBlogCreate, {
      title: blogParams.title,
      description: blogParams.description,
      fullName: blogParams.fullName,
      email: blogParams.email,
      contactNo: blogParams.contactNo,
      status: validationRules.blogStatus[0],
      deletedAt: null,
    });

    sinon.assert.calledOnceWithExactly(stubBlogImageCreate, {
      blogId: createResponse.dataValues.id,
      imageId: blogParams.imageId,
    });

    assert.strictEqual(blog.dataValues.id, createResponse.dataValues.id);
  });

  it('should failed to create a blog', async () => {
    const stubBlogCreate = sandbox.stub(BlogModel, 'create').resolves(0);
    const stubBlogImageCreate = sandbox.stub(BlogImageModel, 'create').resolves(0);

    await assert.rejects(BlogController.create(blogParams), (err) => {
      assert.strictEqual(err.name, 'InternalError');
      assert.deepStrictEqual(err.message, 'Failed to create the Blog');
      return true;
    });

    sinon.assert.calledOnceWithExactly(stubBlogCreate, {
      title: blogParams.title,
      description: blogParams.description,
      fullName: blogParams.fullName,
      email: blogParams.email,
      contactNo: blogParams.contactNo,
      status: validationRules.blogStatus[0],
      deletedAt: null,
    });

    sinon.assert.notCalled(stubBlogImageCreate);
  });

  it('should get a blog by status successfully', async () => {
    const page = 1;
    const limit = 1;
    const status = 'Approved';
    const stubGetBlog = sandbox.stub(BlogModel, 'getBlogsByStatus').resolves([getResponse]);
    const stubGetBlogImage = sandbox.stub(BlogImageModel, 'getBlogsImage').resolves([getImageResponse]);
    const blog = await BlogController.getBlogsByStatus({
      pageNum: page,
      pageSize: limit,
      status,
    });

    sinon.assert.calledOnceWithExactly(stubGetBlog, page, limit, status);
    sinon.assert.calledOnceWithExactly(stubGetBlogImage, [getResponse.dataValues.id]);

    assert.strictEqual(blog[0].dataValues.id, getResponse.dataValues.id);
  });

  it('should throw blog not found when getting blogs by status', async () => {
    const page = 1;
    const limit = 1;
    const status = 'Approved';
    const stubGetBlog = sandbox.stub(BlogModel, 'getBlogsByStatus').resolves([]);
    const stubGetBlogImage = sandbox.stub(BlogImageModel, 'getBlogsImage').resolves([]);

    await assert.rejects(BlogController.getBlogsByStatus({ pageNum: page, pageSize: limit, status }), (err) => {
      assert.strictEqual(err.name, 'NotFoundError');
      assert.deepStrictEqual(err.message, 'Blog not found');
      return true;
    });

    sinon.assert.calledOnceWithExactly(stubGetBlog, page, limit, status);
    sinon.assert.notCalled(stubGetBlogImage);
  });

  it('should delete the blog successfully', async () => {
    const id = 12;
    const stubGetBlog = sandbox.stub(BlogModel, 'getBlogById').resolves([getResponse]);
    const stubGetBlogImage = sandbox.stub(BlogImageModel, 'getBlogsImage').resolves([getImageResponse]);

    const stubDeleteBlog = sandbox.stub(BlogModel, 'deleteBlog').resolves(1);
    const stubDeleteBlogImage = sandbox.stub(BlogImageModel, 'deleteBlogsImage').resolves(1);
    const stubDeleteImage = sandbox.stub(AttachmentModel, 'deleteImage').resolves(1);
    const blog = await BlogController.deleteBlog(id);

    sinon.assert.calledOnceWithExactly(stubGetBlog, id);
    sinon.assert.calledOnceWithExactly(stubGetBlogImage, id);
    sinon.assert.calledOnceWithExactly(stubDeleteBlog, id);
    sinon.assert.calledOnceWithExactly(stubDeleteBlogImage, id);
    sinon.assert.calledOnceWithExactly(stubDeleteImage, [getImageResponse.dataValues.imageId]);

    assert.strictEqual(blog, 1);
  });

  it('should failed to delete the blog', async () => {
    const id = 12;
    const stubGetBlog = sandbox.stub(BlogModel, 'getBlogById').resolves([getResponse]);
    const stubGetBlogImage = sandbox.stub(BlogImageModel, 'getBlogsImage').resolves([getImageResponse]);

    const stubDeleteBlogImage = sandbox.stub(BlogImageModel, 'deleteBlogsImage').resolves(0);
    const stubDeleteImage = sandbox.stub(AttachmentModel, 'deleteImage').resolves(0);
    const stubDeleteBlog = sandbox.stub(BlogModel, 'deleteBlog').resolves(2);

    await assert.rejects(BlogController.deleteBlog(id), (err) => {
      assert.strictEqual(err.name, 'ValidationError');
      assert.deepStrictEqual(err.message, 'Failed to delete the blog');
      return true;
    });

    sinon.assert.calledOnceWithExactly(stubGetBlog, id);
    sinon.assert.calledOnceWithExactly(stubGetBlogImage, id);
    sinon.assert.calledOnceWithExactly(stubDeleteBlogImage, id);
    sinon.assert.calledOnceWithExactly(stubDeleteImage, [getImageResponse.dataValues.imageId]);
    sinon.assert.calledOnceWithExactly(stubDeleteBlog, id);
  });

  it('should throw blog not found when deleting a blog', async () => {
    const id = 12;
    const stubGetBlog = sandbox.stub(BlogModel, 'getBlogById').resolves(0);
    const stubGetBlogImage = sandbox.stub(BlogImageModel, 'getBlogsImage').resolves(0);

    const stubDeleteBlog = sandbox.stub(BlogModel, 'deleteBlog').resolves(0);
    const stubDeleteBlogImage = sandbox.stub(BlogImageModel, 'deleteBlogsImage').resolves(0);
    const stubDeleteImage = sandbox.stub(AttachmentModel, 'deleteImage').resolves(0);

    await assert.rejects(BlogController.deleteBlog(id), (err) => {
      assert.strictEqual(err.name, 'NotFoundError');
      assert.deepStrictEqual(err.message, 'Blog not found');
      return true;
    });

    sinon.assert.calledOnceWithExactly(stubGetBlog, id);
    sinon.assert.notCalled(stubGetBlogImage);
    sinon.assert.notCalled(stubDeleteBlog);
    sinon.assert.notCalled(stubDeleteBlogImage);
    sinon.assert.notCalled(stubDeleteImage);
  });

  it('should update a blog successfully', async () => {
    const id = 11;
    const status = 'Approved';

    const stubGetBlog = sandbox.stub(BlogModel, 'getBlogById').resolves(getResponse);
    const stubBlogUpdate = sandbox.stub(BlogModel, 'updateBlog').resolves([1]);
    await BlogController.update(id, status);

    sinon.assert.calledOnceWithExactly(stubGetBlog, id);
    sinon.assert.calledOnceWithExactly(stubBlogUpdate, {
      id,
      status,
    });
  });

  it('should throw Blog not found when updating a blog', async () => {
    const id = 11;
    const status = 'Approved';

    const stubGetBlog = sandbox.stub(BlogModel, 'getBlogById').resolves(null);
    const stubBlogUpdate = sandbox.stub(BlogModel, 'updateBlog').resolves([1]);
    
    await assert.rejects(BlogController.update(id, status), (err) => {
      assert.strictEqual(err.name, 'NotFoundError');
      assert.deepStrictEqual(err.message, 'Blog not found');
      return true;
    });

    sinon.assert.calledOnceWithExactly(stubGetBlog, id);
    sinon.assert.notCalled(stubBlogUpdate);
  });

  it('should throw ValidationError `Bog is already is approved`', async () => {
    const id = 11;
    const status = 'Approved';

    const stubGetBlog = sandbox.stub(BlogModel, 'getBlogById').resolves({ ...getResponse, dataValues: { ...getResponse.dataValues, status: 'Approved' }});
    const stubBlogUpdate = sandbox.stub(BlogModel, 'updateBlog').resolves([1]);
    
    await assert.rejects(BlogController.update(id, status), (err) => {
      assert.strictEqual(err.name, 'ValidationError');
      assert.deepStrictEqual(err.message, 'Blog is already approved');
      return true;
    });

    sinon.assert.calledOnceWithExactly(stubGetBlog, id);
    sinon.assert.notCalled(stubBlogUpdate);
  });

  it('should get a blog by id successfully', async () => {
    const id = 1;
    const stubGetBlog = sandbox.stub(BlogModel, 'getBlogById').resolves(getResponse);
    const stubGetBlogImage = sandbox.stub(BlogImageModel, 'getBlogsImage').resolves([getImageResponse]);
    const blog = await BlogController.getBlogById(id);

    sinon.assert.calledOnceWithExactly(stubGetBlog, id);
    sinon.assert.calledOnceWithExactly(stubGetBlogImage, id);

    assert.strictEqual(blog.dataValues.id, getResponse.dataValues.id);
  });

  it('should throw Blog not found when getting by id', async () => {
    const id = 1;
    const stubGetBlog = sandbox.stub(BlogModel, 'getBlogById').resolves(0);
    const stubGetBlogImage = sandbox.stub(BlogImageModel, 'getBlogsImage').resolves(0);

    await assert.rejects(BlogController.getBlogById(id), (err) => {
      assert.strictEqual(err.name, 'NotFoundError');
      assert.deepStrictEqual(err.message, 'Blog not found');
      return true;
    });

    sinon.assert.calledOnceWithExactly(stubGetBlog, id);
    sinon.assert.notCalled(stubGetBlogImage);
  });
});
