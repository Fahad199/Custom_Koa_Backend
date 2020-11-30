const blogsModel = require('../models/blogs');
const blogsImageModel = require('../models/blogsImage');
const imageModel = require('../models/attachments');
const { NotFoundError, ValidationError, InternalError } = require('../middlewares/errors');

const {
  config: { BASE_URL, PORT }, validationRules,
} = require('../constants');

class Blogs {
  static async create({ title, description, fullName, email, contactNo, imageId }) {
    const blog = await blogsModel.create({
      title,
      description,
      fullName,
      email,
      contactNo,
      status: validationRules.blogStatus[0],
      deletedAt: null,
    });
    if (!blog || blog.length <= 0) {
      throw new InternalError('Failed to create the Blog');
    }

    if (blog.dataValues) {
      const blogId = blog.dataValues.id;
      return blogsImageModel.create({
        blogId,
        imageId,
      });
    }

    return blog;
  }

  static async getBlogsByStatus({ pageSize, pageNum, status }) {
    const page = parseInt(pageNum, 10);
    const limit = parseInt(pageSize, 10);

    const result = await blogsModel.getBlogsByStatus(page, limit, status);
    if (result.length <= 0) {
      throw new NotFoundError('Blog not found');
    }

    const blogIds = [];
    result.map((blog) => blogIds.push(blog.dataValues.id));

    const blogsImageResult = await blogsImageModel.getBlogsImage(blogIds);
    return result.map((blog, i) => {
      result[i].dataValues.images = blogsImageResult[i].imageId
        ? [
            {
              id: blogsImageResult[i].imageId,
              url: `${BASE_URL}${PORT}/download/${blogsImageResult[i].imageId}`,
            },
          ]
        : [];

      return blog;
    });
  }

  static async deleteBlog(id) {
    const blog = await blogsModel.getBlogById(id);
    if (!blog) {
      throw new NotFoundError('Blog not found');
    }
    const blogsImageResult = await blogsImageModel.getBlogsImage(id);
    const imageId = blogsImageResult.map((image) => image.dataValues.imageId);

    await blogsImageModel.deleteBlogsImage(id);
    await imageModel.deleteImage(imageId);

    const result = await blogsModel.deleteBlog(id);

    if (result > 1) {
      throw new ValidationError('Failed to delete the blog');
    }

    return result;
  }

  static async update(id, status) {
    const blog = await blogsModel.getBlogById(id);
    if (!blog) {
      throw new NotFoundError('Blog not found');
    }

    if (blog.dataValues.status === validationRules.blogStatus[1] && status === validationRules.blogStatus[1]) {
      throw new ValidationError('Blog is already approved');
    }

    const result = await blogsModel.updateBlog({ id, status });
    return result;
  }

  static async getBlogById(id) {
    const blog = await blogsModel.getBlogById(id);
    if (!blog) {
      throw new NotFoundError('Blog not found');
    }
    const blogsImageResult = await blogsImageModel.getBlogsImage(id);
    blog.dataValues.images = blogsImageResult.map((image) => ({
      id: image.imageId,
      url: `${BASE_URL}${PORT}/download/attachment/${image.imageId}`,
    }));

    return blog;
  }
}

module.exports = Blogs;
