const userModel = require('../models/user');
const { InternalError, NotFoundError, ValidationError } = require('../middlewares/errors');

class User {
  static async create({ name, userName, password, role }) {
    const user = await userModel.create({
      name,
      userName,
      password,
      role,
    });

    if (!user || user.length <= 0) {
      throw new InternalError('Failed to create the user');
    }

    return user;
  }

  static async update({ id, name, userName, role }) {
    const user = await userModel.getUserById(id);
    if (!user) {
      throw new NotFoundError('User not found');
    }
    const updateUser = await userModel.updateUser({
      id,
      name,
      userName,
      role,
    });

    if (!updateUser || updateUser.length <= 0) {
      throw new InternalError('Failed to update the user');
    }

    return updateUser;
  }

  static async getUsers({ pageSize, pageNum }) {
    const page = parseInt(pageNum, 10);
    const limit = parseInt(pageSize, 10);

    const users = await userModel.getUsers(page, limit);

    if (users.length <= 0) {
      throw new NotFoundError('User not found');
    }

    return users.map((user) => user.dataValues);
  }

  static async getUser({ userName, password }) {
    const user = await userModel.getUser(userName, password);

    if (!user) {
      throw new NotFoundError('User not found');
    }

    return user;
  }

  static async delete(id) {
    const result = await userModel.deleteUser(id);
    if (!result) {
      throw new NotFoundError('User not found');
    }

    if (result > 1) {
      throw new ValidationError('Failed to delete the user');
    }
    
    return result;
  }
}

module.exports = User;
