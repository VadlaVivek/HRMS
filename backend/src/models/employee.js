const { DataTypes } = require('sequelize');
const sequelize = require('../db');

const Employee = sequelize.define('Employee', {
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
  firstname: {
    type: DataTypes.STRING,
    allowNull: false
  },
  lastname: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false,
    validate: {
      isEmail: true
    }
  },
  phone: {
    type: DataTypes.STRING
  },
  position: {
    type: DataTypes.STRING
  },
  department: {
    type: DataTypes.STRING
  }
}, {
  tableName: 'employees',
  timestamps: true
});

module.exports = Employee;
