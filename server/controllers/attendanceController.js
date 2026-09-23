const pool = require('../config/db');

// Mark attendance for a user at an event (Admin only)
const markAttendance = async (req, res) => {
  try {
    const { event_id, user_id, status } = req.body;

    // Check if attendance record already exists
    const [existing] = await pool.query(
      'SELECT id FROM attendance WHERE event_id = ? AND user_id = ?',
      [event_id, user_id]
    );

    if (existing.length > 0) {
      // Update existing record
      await pool.query(
        'UPDATE attendance SET status = ?, marked_at = CURRENT_TIMESTAMP WHERE id = ?',
        [status, existing[0].id]
      );
    } else {
      // Insert new record
      await pool.query(
        'INSERT INTO attendance (event_id, user_id, status) VALUES (?, ?, ?)',
        [event_id, user_id, status]
      );
    }

    res.status(200).json({ success: true, data: { message: 'Attendance recorded' } });
  } catch (err) {
    console.error('MarkAttendance error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Get attendance records for a specific event (Admin only)
const getEventAttendance = async (req, res) => {
  try {
    const [records] = await pool.query(`
      SELECT a.id, a.user_id, a.status, a.marked_at, u.name, u.email, u.department
      FROM attendance a
      JOIN users u ON a.user_id = u.id
      WHERE a.event_id = ?`, [req.params.eventId]);
    res.status(200).json({ success: true, data: records });
  } catch (err) {
    console.error('GetEventAttendance error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

module.exports = { markAttendance, getEventAttendance };
