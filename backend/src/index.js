require('dotenv').config();

const express = require('express');
const cors = require('cors');
const { sequelize } = require('./models');
const errorHandler = require('./middlewares/errorHandler');

const authRoutes = require('./routes/auth');
const employeeRoutes = require('./routes/employees');
const teamRoutes = require('./routes/teams');

const app = express();
const PORT = process.env.PORT || 5000;

const corsOptions = {
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://hrms-frontend.onrender.com'] // Your frontend URL
    : 'http://localhost:3000',
  credentials: true
};
// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors(corsOptions));


// Health check
app.get('/', (req, res) => {
  res.json({ 
    success: true,
    message: 'Evallo HRMS API is running',
    version: '1.0.0'
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/employees', employeeRoutes);
app.use('/api/teams', teamRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ 
    success: false,
    message: 'Route not found' 
  });
});

// Error handling
app.use(errorHandler);

// Start server
const startServer = async () => {
  try {
    await sequelize.authenticate();
    console.log('✓ Database connected successfully');
    
    await sequelize.sync({ alter: true });
    console.log('✓ Database synchronized');
    
    app.listen(PORT, () => {
      console.log(`✓ Server running on port ${PORT}`);
      console.log(`✓ Environment: ${process.env.NODE_ENV}`);
    });
  } catch (error) {
    console.error('✗ Unable to start server:', error);
    process.exit(1);
  }
};

startServer();
