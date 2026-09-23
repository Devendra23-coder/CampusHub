const express = require('express');
const router = express.Router();
const { getAllEvents, getEventById, createEvent, updateEvent, deleteEvent } = require('../controllers/eventController');
const { eventValidator } = require('../utils/validators');
const auth = require('../middleware/auth');
const roleCheck = require('../middleware/roleCheck');

router.get('/', auth, getAllEvents);
router.get('/:id', auth, getEventById);
router.post('/', auth, roleCheck('admin'), eventValidator, createEvent);
router.put('/:id', auth, roleCheck('admin'), eventValidator, updateEvent);
router.delete('/:id', auth, roleCheck('admin'), deleteEvent);

module.exports = router;
