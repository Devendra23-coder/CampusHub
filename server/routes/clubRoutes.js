const express = require('express');
const router = express.Router();
const { getAllClubs, getClubById, createClub, updateClub, deleteClub } = require('../controllers/clubController');
const { clubValidator } = require('../utils/validators');
const auth = require('../middleware/auth');
const roleCheck = require('../middleware/roleCheck');

router.get('/', auth, getAllClubs);
router.get('/:id', auth, getClubById);
router.post('/', auth, roleCheck('admin'), clubValidator, createClub);
router.put('/:id', auth, roleCheck('admin'), clubValidator, updateClub);
router.delete('/:id', auth, roleCheck('admin'), deleteClub);

module.exports = router;
