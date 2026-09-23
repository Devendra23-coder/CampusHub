const express = require('express');
const router = express.Router();
const { getProfile, updateProfile, getAllUsers, deleteUser } = require('../controllers/userController');
const auth = require('../middleware/auth');
const roleCheck = require('../middleware/roleCheck');

router.get('/profile', auth, getProfile);
router.put('/profile', auth, updateProfile);
router.get('/', auth, roleCheck('admin'), getAllUsers);
router.delete('/:id', auth, roleCheck('admin'), deleteUser);

module.exports = router;
