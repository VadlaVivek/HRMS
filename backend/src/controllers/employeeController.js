const { Employee, Team, Log } = require('../models');

exports.getEmployees = async (req, res, next) => {
  try {
    const employees = await Employee.findAll({
      where: { organisationId: req.user.organisationId },
      include: [{ 
        model: Team, 
        as: 'teams',
        through: { attributes: [] },
        attributes: ['id', 'name']
      }],
      order: [['createdAt', 'DESC']]
    });

    res.json({ success: true, data: employees });
  } catch (error) {
    next(error);
  }
};

exports.getEmployee = async (req, res, next) => {
  try {
    const employee = await Employee.findOne({
      where: { 
        id: req.params.id,
        organisationId: req.user.organisationId 
      },
      include: [{ 
        model: Team, 
        as: 'teams',
        through: { attributes: [] }
      }]
    });

    if (!employee) {
      return res.status(404).json({ 
        success: false,
        message: 'Employee not found' 
      });
    }

    res.json({ success: true, data: employee });
  } catch (error) {
    next(error);
  }
};

exports.createEmployee = async (req, res, next) => {
  try {
    const { firstname, lastname, email, phone, position, department } = req.body;

    if (!firstname || !lastname || !email) {
      return res.status(400).json({ 
        success: false,
        message: 'First name, last name, and email are required' 
      });
    }

    const employee = await Employee.create({
      organisationId: req.user.organisationId,
      firstname,
      lastname,
      email,
      phone,
      position,
      department
    });

    await Log.create({
      organisationId: req.user.organisationId,
      userId: req.user.userId,
      action: 'create',
      entity: 'employee',
      entityId: employee.id,
      metadata: { firstname, lastname, email }
    });

    res.status(201).json({ 
      success: true, 
      message: 'Employee created successfully',
      data: employee 
    });
  } catch (error) {
    next(error);
  }
};

exports.updateEmployee = async (req, res, next) => {
  try {
    const employee = await Employee.findOne({
      where: { 
        id: req.params.id,
        organisationId: req.user.organisationId 
      }
    });

    if (!employee) {
      return res.status(404).json({ 
        success: false,
        message: 'Employee not found' 
      });
    }

    const { firstname, lastname, email, phone, position, department } = req.body;
    
    await employee.update({
      firstname: firstname || employee.firstname,
      lastname: lastname || employee.lastname,
      email: email || employee.email,
      phone: phone !== undefined ? phone : employee.phone,
      position: position !== undefined ? position : employee.position,
      department: department !== undefined ? department : employee.department
    });

    await Log.create({
      organisationId: req.user.organisationId,
      userId: req.user.userId,
      action: 'update',
      entity: 'employee',
      entityId: employee.id,
      metadata: { changes: req.body }
    });

    res.json({ 
      success: true, 
      message: 'Employee updated successfully',
      data: employee 
    });
  } catch (error) {
    next(error);
  }
};

exports.deleteEmployee = async (req, res, next) => {
  try {
    const employee = await Employee.findOne({
      where: { 
        id: req.params.id,
        organisationId: req.user.organisationId 
      }
    });

    if (!employee) {
      return res.status(404).json({ 
        success: false,
        message: 'Employee not found' 
      });
    }

    const employeeData = employee.toJSON();
    await employee.destroy();

    await Log.create({
      organisationId: req.user.organisationId,
      userId: req.user.userId,
      action: 'delete',
      entity: 'employee',
      entityId: req.params.id,
      metadata: employeeData
    });

    res.json({ 
      success: true, 
      message: 'Employee deleted successfully' 
    });
  } catch (error) {
    next(error);
  }
};

exports.assignTeam = async (req, res, next) => {
  try {
    const { teamId } = req.body;
    
    if (!teamId) {
      return res.status(400).json({ 
        success: false,
        message: 'Team ID is required' 
      });
    }

    const employee = await Employee.findOne({
      where: { 
        id: req.params.id,
        organisationId: req.user.organisationId 
      }
    });

    if (!employee) {
      return res.status(404).json({ 
        success: false,
        message: 'Employee not found' 
      });
    }

    const team = await Team.findOne({
      where: { 
        id: teamId,
        organisationId: req.user.organisationId 
      }
    });

    if (!team) {
      return res.status(404).json({ 
        success: false,
        message: 'Team not found' 
      });
    }

    await employee.addTeam(team);

    await Log.create({
      organisationId: req.user.organisationId,
      userId: req.user.userId,
      action: 'assign_team',
      entity: 'employee',
      entityId: employee.id,
      metadata: { teamId, teamName: team.name }
    });

    res.json({ 
      success: true, 
      message: 'Team assigned successfully' 
    });
  } catch (error) {
    next(error);
  }
};

exports.unassignTeam = async (req, res, next) => {
  try {
    const { teamId } = req.body;
    
    if (!teamId) {
      return res.status(400).json({ 
        success: false,
        message: 'Team ID is required' 
      });
    }

    const employee = await Employee.findOne({
      where: { 
        id: req.params.id,
        organisationId: req.user.organisationId 
      }
    });

    if (!employee) {
      return res.status(404).json({ 
        success: false,
        message: 'Employee not found' 
      });
    }

    const team = await Team.findOne({
      where: { 
        id: teamId,
        organisationId: req.user.organisationId 
      }
    });

    if (!team) {
      return res.status(404).json({ 
        success: false,
        message: 'Team not found' 
      });
    }

    await employee.removeTeam(team);

    await Log.create({
      organisationId: req.user.organisationId,
      userId: req.user.userId,
      action: 'unassign_team',
      entity: 'employee',
      entityId: employee.id,
      metadata: { teamId, teamName: team.name }
    });

    res.json({ 
      success: true, 
      message: 'Team unassigned successfully' 
    });
  } catch (error) {
    next(error);
  }
};
