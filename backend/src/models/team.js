const { DataTypes } = require('sequelize');
const sequelize = require('../db');

const Team = sequelize.define('Team', {
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
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT
  }
}, {
  tableName: 'teams',
  timestamps: true
});

module.exports = Team;
