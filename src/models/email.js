const { Model } = require('sequelize');
const sequelize = require('../helpers/dbConnection');
const { emailSchema } = require('./schemas');

class EmailAccounts extends Model {
  static getEmails(page, limit) {
    return this.findAll({
      attributes: { exclude: ['deletedAt'] },
      order: [['createdAt', 'ASC']],
      offset: (page - 1) * limit,
      limit,
    });
  }

  static getEmailById(id) {
    return this.findOne({ where: { id } });
  }

  static updateEmail({ id, name, email }) {
    return this.update({ name, email }, { where: { id } });
  }

  static deleteEmail(id) {
    return this.destroy({ where: { id } });
  }

  static getAllEmails() {
    return this.findAll({ attributes: ['email'] });
  }
}

EmailAccounts.init(emailSchema, {
  sequelize,
  paranoid: true,
  modelName: 'email_accounts',
});

module.exports = EmailAccounts;
