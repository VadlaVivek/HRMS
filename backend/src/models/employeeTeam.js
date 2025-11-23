const { DataTypes } = require('sequelize');
const sequelize = require('../db');

const EmployeeTeam = sequelize.define('EmployeeTeam', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  employeeId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'employees',
      key: 'id'
    }
  },
  teamId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'teams',
      key: 'id'
    }
  }
}, {
  tableName: 'employee_teams',
  timestamps: true
});

module.exports = EmployeeTeam;
