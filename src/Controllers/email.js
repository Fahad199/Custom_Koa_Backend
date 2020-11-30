const emailModel = require('../models/email');
const { NotFoundError, InternalError, ValidationError } = require('../middlewares/errors');

class Email {
  static async create({ name, email }) {
    const newEmail = await emailModel.create({
      name,
      email,
    });

    if (!newEmail || newEmail.length <= 0) {
      throw new InternalError('Failed to create the email');
    }

    return newEmail;
  }

  static async update(id, name, email) {
    const getEmail = await emailModel.getEmailById(id);
    if (!getEmail) {
      throw new NotFoundError('Email not found');
    }
    const updateEmail = await emailModel.updateEmail({
      id,
      name,
      email,
    });

    if (!updateEmail || updateEmail.length <= 0) {
      throw new InternalError('Failed to update the email');
    }

    return updateEmail;
  }

  static async getEmails({ pageNum, pageSize }) {
    const page = parseInt(pageNum, 10);
    const limit = parseInt(pageSize, 10);

    const emails = await emailModel.getEmails(page, limit);

    if (emails.length <= 0) {
      throw new NotFoundError('Email not found');
    }

    return emails.map((email) => email.dataValues);
  }

  static async delete(id) {
    const result = await emailModel.deleteEmail(id);
    if (!result) {
      throw new NotFoundError('Email not found');
    }

    if (result > 1) {
      throw new ValidationError('Failed to delete an email');
    }

    return result;
  }
}

module.exports = Email;
