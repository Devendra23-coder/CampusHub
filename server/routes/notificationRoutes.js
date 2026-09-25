const express = require('express');
const router = express.Router();
const { getNotifications, markAsRead, markAllRead } = require('../controllers/notificationController');
const auth = require('../middleware/auth');
const roleCheck = require('../middleware/roleCheck');

// All notification routes require admin authentication
router.get('/', auth, roleCheck('admin'), getNotifications);
router.put('/read-all', auth, roleCheck('admin'), markAllRead);
router.put('/:id/read', auth, roleCheck('admin'), markAsRead);

module.exports = router;
