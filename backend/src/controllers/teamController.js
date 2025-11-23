const { Team, Employee, Log } = require('../models');

exports.getTeams = async (req, res, next) => {
  try {
    const teams = await Team.findAll({
      where: { organisationId: req.user.organisationId },
      include: [{ 
        model: Employee, 
        as: 'employees',
        through: { attributes: [] },
        attributes: ['id', 'firstname', 'lastname', 'email']
      }],
      order: [['createdAt', 'DESC']]
    });

    res.json({ success: true, data: teams });
  } catch (error) {
    next(error);
  }
};

exports.getTeam = async (req, res, next) => {
  try {
    const team = await Team.findOne({
      where: { 
        id: req.params.id,
        organisationId: req.user.organisationId 
      },
      include: [{ 
        model: Employee, 
        as: 'employees',
        through: { attributes: [] }
      }]
    });

    if (!team) {
      return res.status(404).json({ 
        success: false,
        message: 'Team not found' 
      });
    }

    res.json({ success: true, data: team });
  } catch (error) {
    next(error);
  }
};

exports.createTeam = async (req, res, next) => {
  try {
    const { name, description } = req.body;

    if (!name) {
      return res.status(400).json({ 
        success: false,
        message: 'Team name is required' 
      });
    }

    const team = await Team.create({
      organisationId: req.user.organisationId,
      name,
      description
    });

    await Log.create({
      organisationId: req.user.organisationId,
      userId: req.user.userId,
      action: 'create',
      entity: 'team',
      entityId: team.id,
      metadata: { name, description }
    });

    res.status(201).json({ 
      success: true, 
      message: 'Team created successfully',
      data: team 
    });
  } catch (error) {
    next(error);
  }
};

exports.updateTeam = async (req, res, next) => {
  try {
    const team = await Team.findOne({
      where: { 
        id: req.params.id,
        organisationId: req.user.organisationId 
      }
    });

    if (!team) {
      return res.status(404).json({ 
        success: false,
        message: 'Team not found' 
      });
    }

    const { name, description } = req.body;
    
    await team.update({ 
      name: name || team.name, 
      description: description !== undefined ? description : team.description 
    });

    await Log.create({
      organisationId: req.user.organisationId,
      userId: req.user.userId,
      action: 'update',
      entity: 'team',
      entityId: team.id,
      metadata: { changes: req.body }
    });

    res.json({ 
      success: true, 
      message: 'Team updated successfully',
      data: team 
    });
  } catch (error) {
    next(error);
  }
};

exports.deleteTeam = async (req, res, next) => {
  try {
    const team = await Team.findOne({
      where: { 
        id: req.params.id,
        organisationId: req.user.organisationId 
      }
    });

    if (!team) {
      return res.status(404).json({ 
        success: false,
        message: 'Team not found' 
      });
    }

    const teamData = team.toJSON();
    await team.destroy();

    await Log.create({
      organisationId: req.user.organisationId,
      userId: req.user.userId,
      action: 'delete',
      entity: 'team',
      entityId: req.params.id,
      metadata: teamData
    });

    res.json({ 
      success: true, 
      message: 'Team deleted successfully' 
    });
  } catch (error) {
    next(error);
  }
};
