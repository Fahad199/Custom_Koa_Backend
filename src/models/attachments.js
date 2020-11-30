const { Model } = require('sequelize');
const sequelize = require('../helpers/dbConnection');
const { imageSchema } = require('./schemas');

class Attachments extends Model {
  static getImage(id) {
    return this.findOne({ where: { id } });
  }

  static deleteImage(id) {
    return this.destroy({ where: { id } });
  }

  static getAllImage(imageIds) {
    return this.findAll({
      where: { id: imageIds },
      attributes: { exclude: ['deletedAt'] },
    });
  }
}

Attachments.init(imageSchema, {
  sequelize,
  paranoid: true,
  modelName: 'attachments',
});

module.exports = Attachments;
