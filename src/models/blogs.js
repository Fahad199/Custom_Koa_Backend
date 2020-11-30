const { Model } = require('sequelize');
const sequelize = require('../helpers/dbConnection');
const { blogsSchema } = require('./schemas');

class Blogs extends Model {
  static getBlogsByStatus(page, limit, status) {
    if (page && limit) {
      return this.findAll({
        where: {
          status: status || 'Pending',
        },
        attributes: {
          exclude: ['deletedAt'],
        },
        order: [['createdAt', 'ASC']],
        offset: (page - 1) * limit,
        limit,
      });
    }

    return this.findAll({
      where: { status: status || 'Pending' },
      attributes: {
        exclude: ['deletedAt'],
      },
    });
  }

  static deleteBlog(id) {
    return this.destroy({
      where: {
        id,
      },
    });
  }

  static updateBlog({ id, status }) {
    return this.update(
      { status },
      {
        where: {
          id,
        },
      },
    );
  }

  static getBlogById(id) {
    return this.findOne({
      where: { id },
      attributes: { exclude: ['deletedAt'] },
    });
  }
}

Blogs.init(blogsSchema, {
  sequelize,
  paranoid: true,
  modelName: 'blogs',
});

module.exports = Blogs;
