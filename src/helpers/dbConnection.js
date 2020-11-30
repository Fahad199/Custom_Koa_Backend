const { Sequelize } = require('sequelize');
const {
  config: { host, user, dialect, database },
} = require('../constants');

const sequelize = new Sequelize(database, user, '', {
  host,
  dialect,
});

module.exports = sequelize;
