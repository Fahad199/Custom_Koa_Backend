const { Model } = require('sequelize');
const sequelize = require('../helpers/dbConnection');
const { userSchema } = require('./schemas');

class User extends Model {
  static updateUser({ id, name, userName, role }) {
    return this.update({ name, userName, role }, { where: { id } });
  }

  static getUsers(page, limit) {
    if (page && limit) {
      return this.findAll({
        attributes: { exclude: ['createdAt', 'updatedAt', 'password'] },
        order: [['createdAt', 'ASC']],
        offset: (page - 1) * limit,
        limit,
      });
    }
    return this.findAll({
      attributes: { exclude: ['createdAt', 'updatedAt', 'password'] },
    });
  }

  static getUser(userName, password) {
    return this.findOne({
      attributes: { exclude: ['createdAt', 'updatedAt'] },
      where: { userName, password },
    });
  }

  static getUserById(id) {
    return this.findOne({ where: { id } });
  }

  static deleteUser(id) {
    return this.destroy({ where: { id } });
  }
}

User.init(userSchema, {
  sequelize,
  modelName: 'users',
});

module.exports = User;
