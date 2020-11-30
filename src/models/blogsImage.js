const { Model } = require('sequelize');
const sequelize = require('../helpers/dbConnection');
const { blogsImageSchema } = require('./schemas');

class BlogsImage extends Model {
  static getBlogsImage(blogId) {
    return this.findAll({ where: { blogId } });
  }

  static deleteBlogsImage(blogId) {
    return this.destroy({ where: { blogId } });
  }
}

BlogsImage.init(blogsImageSchema, {
  sequelize,
  paranoid: true,
  modelName: 'blogs_images',
});

module.exports = BlogsImage;
