const express = require('express');
const router = express.Router();
const { markAttendance, getEventAttendance } = require('../controllers/attendanceController');
const auth = require('../middleware/auth');
const roleCheck = require('../middleware/roleCheck');

router.post('/', auth, roleCheck('admin'), markAttendance);
router.get('/event/:eventId', auth, roleCheck('admin'), getEventAttendance);

module.exports = router;
