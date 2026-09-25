const pool = require('../config/db');

// Get all notifications (admin only)
const getNotifications = async (req, res) => {
  try {
    const [notifications] = await pool.query(
      'SELECT * FROM notifications ORDER BY created_at DESC LIMIT 50'
    );
    res.status(200).json({ success: true, data: notifications });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Mark a single notification as read (admin only)
const markAsRead = async (req, res) => {
  try {
    const [result] = await pool.query(
      'UPDATE notifications SET is_read = 1 WHERE id = ?',
      [req.params.id]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Notification not found' });
    }
    res.status(200).json({ success: true, data: { message: 'Notification marked as read' } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Mark all notifications as read (admin only)
const markAllRead = async (req, res) => {
  try {
    await pool.query('UPDATE notifications SET is_read = 1 WHERE is_read = 0');
    res.status(200).json({ success: true, data: { message: 'All notifications marked as read' } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = { getNotifications, markAsRead, markAllRead };
