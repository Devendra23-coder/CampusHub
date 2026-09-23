const pool = require('../config/db');

// Get all announcements (newest first)
const getAllAnnouncements = async (req, res) => {
  try {
    const [announcements] = await pool.query('SELECT * FROM announcements ORDER BY created_at DESC');
    res.status(200).json({ success: true, data: announcements });
  } catch (err) {
    console.error('GetAllAnnouncements error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Get single announcement by ID
const getAnnouncementById = async (req, res) => {
  try {
    const [announcements] = await pool.query('SELECT * FROM announcements WHERE id = ?', [req.params.id]);
    if (announcements.length === 0) return res.status(404).json({ success: false, message: 'Announcement not found' });
    res.status(200).json({ success: true, data: announcements[0] });
  } catch (err) {
    console.error('GetAnnouncementById error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Create announcement (Admin only)
const createAnnouncement = async (req, res) => {
  try {
    const { title, content, priority } = req.body;
    const [result] = await pool.query(
      'INSERT INTO announcements (title, content, priority, created_by) VALUES (?, ?, ?, ?)',
      [title, content, priority || 'medium', req.user.id]
    );
    res.status(201).json({ success: true, data: { id: result.insertId, title, content, priority } });
  } catch (err) {
    console.error('CreateAnnouncement error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Update announcement (Admin only)
const updateAnnouncement = async (req, res) => {
  try {
    const { title, content, priority } = req.body;
    const [result] = await pool.query(
      'UPDATE announcements SET title=?, content=?, priority=? WHERE id=?',
      [title, content, priority, req.params.id]
    );
    if (result.affectedRows === 0) return res.status(404).json({ success: false, message: 'Announcement not found' });
    res.status(200).json({ success: true, data: { message: 'Announcement updated' } });
  } catch (err) {
    console.error('UpdateAnnouncement error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Delete announcement (Admin only)
const deleteAnnouncement = async (req, res) => {
  try {
    const [result] = await pool.query('DELETE FROM announcements WHERE id = ?', [req.params.id]);
    if (result.affectedRows === 0) return res.status(404).json({ success: false, message: 'Announcement not found' });
    res.status(200).json({ success: true, data: { message: 'Announcement deleted' } });
  } catch (err) {
    console.error('DeleteAnnouncement error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

module.exports = { getAllAnnouncements, getAnnouncementById, createAnnouncement, updateAnnouncement, deleteAnnouncement };
