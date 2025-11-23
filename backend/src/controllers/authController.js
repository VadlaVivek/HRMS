const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { Organisation, User, Log } = require('../models');

exports.register = async (req, res, next) => {
  try {
    const { organisationName, organisationEmail, userEmail, password } = req.body;

    if (!organisationName || !organisationEmail || !userEmail || !password) {
      return res.status(400).json({ 
        success: false,
        message: 'All fields are required' 
      });
    }

    const existingOrg = await Organisation.findOne({ 
      where: { email: organisationEmail } 
    });
    
    if (existingOrg) {
      return res.status(400).json({ 
        success: false,
        message: 'Organisation email already exists' 
      });
    }

    const existingUser = await User.findOne({ 
      where: { email: userEmail } 
    });
    
    if (existingUser) {
      return res.status(400).json({ 
        success: false,
        message: 'User email already exists' 
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const organisation = await Organisation.create({
      name: organisationName,
      email: organisationEmail
    });

    const user = await User.create({
      organisationId: organisation.id,
      email: userEmail,
      password: hashedPassword,
      role: 'admin'
    });

    await Log.create({
      organisationId: organisation.id,
      userId: user.id,
      action: 'register',
      entity: 'organisation',
      entityId: organisation.id,
      metadata: { organisationName, userEmail }
    });

    const token = jwt.sign(
      { 
        userId: user.id, 
        organisationId: organisation.id, 
        role: user.role 
      },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRE }
    );

    res.status(201).json({
      success: true,
      message: 'Organisation registered successfully',
      token,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        organisationId: organisation.id,
        organisationName: organisation.name
      }
    });
  } catch (error) {
    next(error);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ 
        success: false,
        message: 'Email and password are required' 
      });
    }

    const user = await User.findOne({ 
      where: { email },
      include: [{ model: Organisation }]
    });

    if (!user) {
      return res.status(401).json({ 
        success: false,
        message: 'Invalid credentials' 
      });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ 
        success: false,
        message: 'Invalid credentials' 
      });
    }

    await Log.create({
      organisationId: user.organisationId,
      userId: user.id,
      action: 'login',
      entity: 'user',
      entityId: user.id
    });

    const token = jwt.sign(
      { 
        userId: user.id, 
        organisationId: user.organisationId, 
        role: user.role 
      },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRE }
    );

    res.json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        organisationId: user.organisationId,
        organisationName: user.Organisation.name
      }
    });
  } catch (error) {
    next(error);
  }
};
