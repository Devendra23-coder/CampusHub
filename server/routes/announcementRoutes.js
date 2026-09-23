const express = require('express');
const router = express.Router();
const { getAllAnnouncements, getAnnouncementById, createAnnouncement, updateAnnouncement, deleteAnnouncement } = require('../controllers/announcementController');
const { announcementValidator } = require('../utils/validators');
const auth = require('../middleware/auth');
const roleCheck = require('../middleware/roleCheck');

router.get('/', auth, getAllAnnouncements);
router.get('/:id', auth, getAnnouncementById);
router.post('/', auth, roleCheck('admin'), announcementValidator, createAnnouncement);
router.put('/:id', auth, roleCheck('admin'), announcementValidator, updateAnnouncement);
router.delete('/:id', auth, roleCheck('admin'), deleteAnnouncement);

module.exports = router;
