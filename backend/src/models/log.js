const { DataTypes } = require('sequelize');
const sequelize = require('../db');

const Log = sequelize.define('Log', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  organisationId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'organisations',
      key: 'id'
    }
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  action: {
    type: DataTypes.STRING,
    allowNull: false
  },
  entity: {
    type: DataTypes.STRING
  },
  entityId: {
    type: DataTypes.INTEGER
  },
  metadata: {
    type: DataTypes.JSONB,
    defaultValue: {}
  }
}, {
  tableName: 'logs',
  timestamps: true,
  updatedAt: false
});

module.exports = Log;
