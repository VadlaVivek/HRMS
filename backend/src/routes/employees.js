const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const {
  getEmployees,
  getEmployee,
  createEmployee,
  updateEmployee,
  deleteEmployee,
  assignTeam,
  unassignTeam
} = require('../controllers/employeeController');

router.use(authMiddleware);

router.get('/', getEmployees);
router.get('/:id', getEmployee);
router.post('/', createEmployee);
router.put('/:id', updateEmployee);
router.delete('/:id', deleteEmployee);
router.post('/:id/assign-team', assignTeam);
router.post('/:id/unassign-team', unassignTeam);

module.exports = router;
