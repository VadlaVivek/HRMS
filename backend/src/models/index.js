const sequelize = require('../db');
const Organisation = require('./organisation');
const User = require('./user');
const Employee = require('./employee');
const Team = require('./team');
const EmployeeTeam = require('./employeeTeam');
const Log = require('./log');

// Define associations
Organisation.hasMany(User, { foreignKey: 'organisationId', onDelete: 'CASCADE' });
User.belongsTo(Organisation, { foreignKey: 'organisationId' });

Organisation.hasMany(Employee, { foreignKey: 'organisationId', onDelete: 'CASCADE' });
Employee.belongsTo(Organisation, { foreignKey: 'organisationId' });

Organisation.hasMany(Team, { foreignKey: 'organisationId', onDelete: 'CASCADE' });
Team.belongsTo(Organisation, { foreignKey: 'organisationId' });

Employee.belongsToMany(Team, { 
  through: EmployeeTeam, 
  foreignKey: 'employeeId',
  otherKey: 'teamId',
  as: 'teams'
});

Team.belongsToMany(Employee, { 
  through: EmployeeTeam, 
  foreignKey: 'teamId',
  otherKey: 'employeeId',
  as: 'employees'
});

Organisation.hasMany(Log, { foreignKey: 'organisationId', onDelete: 'CASCADE' });
Log.belongsTo(Organisation, { foreignKey: 'organisationId' });

module.exports = {
  sequelize,
  Organisation,
  User,
  Employee,
  Team,
  EmployeeTeam,
  Log
};
