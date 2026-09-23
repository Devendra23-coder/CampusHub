const express = require('express');
const router = express.Router();
const { registerForEvent, getMyRegistrations, cancelRegistration, getEventRegistrations } = require('../controllers/registrationController');
const auth = require('../middleware/auth');
const roleCheck = require('../middleware/roleCheck');

router.post('/', auth, registerForEvent);
router.get('/my', auth, getMyRegistrations);
router.put('/:id/cancel', auth, cancelRegistration);
router.get('/event/:eventId', auth, roleCheck('admin'), getEventRegistrations);

module.exports = router;
