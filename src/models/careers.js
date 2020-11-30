const { Model } = require('sequelize');
const sequelize = require('../helpers/dbConnection');
const { careerSchema } = require('./schemas');

class Careers extends Model {
  static getCareerForms(page, limit, sort) {
    return this.findAll({
      attributes: { exclude: ['deletedAt'] },
      order: [['createdAt', sort || 'ASC']],
      offset: (page - 1) * limit,
      limit,
    });
  }

  static getCareerFormById(id) {
    return this.findOne({ where: { id } });
  }
}

Careers.init(careerSchema, {
  sequelize,
  paranoid: true,
  modelName: 'careers',
});

module.exports = Careers;
