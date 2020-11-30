const { Model } = require('sequelize');
const sequelize = require('../helpers/dbConnection');
const { contactUsSchema } = require('./schemas');

class ContactUs extends Model {
  static get(page, limit) {
    if (page && limit) {
      return this.findAll({
        attributes: { exclude: ['deletedAt'] },
        order: [['createdAt', 'ASC']],
        offset: (page - 1) * limit,
        limit,
      });
    }
    return this.findAll({ attributes: { exclude: ['deletedAt'] } });
  }
}

ContactUs.init(contactUsSchema, {
  sequelize,
  paranoid: true,
  modelName: 'contact_us',
});

module.exports = ContactUs;
