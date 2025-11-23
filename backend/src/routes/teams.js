const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const {
  getTeams,
  getTeam,
  createTeam,
  updateTeam,
  deleteTeam
} = require('../controllers/teamController');

router.use(authMiddleware);

router.get('/', getTeams);
router.get('/:id', getTeam);
router.post('/', createTeam);
router.put('/:id', updateTeam);
router.delete('/:id', deleteTeam);

module.exports = router;
