#  Human Resource Management System

A full-stack HRMS application built with React, Node.js, Express, and PostgreSQL.

## Features

-  Organization account registration and authentication
-  Employee management (CRUD operations)
-  Team management (CRUD operations)
-  Many-to-many employee-team relationships
-  Audit logging for all operations
-  JWT-based authentication
-  Responsive UI design

## Tech Stack

### Backend
- Node.js
- Express.js
- PostgreSQL
- Sequelize ORM
- JWT Authentication
- bcrypt for password hashing

### Frontend
- React.js
- React Router
- Axios
- CSS3

## Project Structure

hrms/
├── backend/
│   ├── src/
│   │ ├── controllers/
│   │ ├── middlewares/
│   │ ├── models/
│   │ ├── routes/
│   │ ├── db.js
│   │ └── index.js
│   ├── .env
│   ├── .gitignore
│   └── package.json
│
└── frontend/
        ├── src/
        │ ├── components/
        │ ├── pages/
        │ ├── services/
        │ ├── App.js
        │ └── index.js
        ├── public/
        └── package.json