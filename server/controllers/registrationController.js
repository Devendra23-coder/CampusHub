const pool = require('../config/db');

// Register for event
const registerForEvent = async (req, res) => {
  try {
    const { event_id } = req.body;
    
    // Check event exists and space available
    const [events] = await pool.query('SELECT max_participants FROM events WHERE id=?', [event_id]);
    if (events.length === 0) return res.status(404).json({ success: false, message: 'Event not found' });
    
    const [regs] = await pool.query('SELECT COUNT(*) as count FROM registrations WHERE event_id=? AND status!=?', [event_id, 'cancelled']);
    if (events[0].max_participants && regs[0].count >= events[0].max_participants) {
      return res.status(400).json({ success: false, message: 'Event is full' });
    }

    // Check if already registered
    const [existing] = await pool.query('SELECT id FROM registrations WHERE event_id=? AND user_id=? AND status!=?', [event_id, req.user.id, 'cancelled']);
    if (existing.length > 0) return res.status(400).json({ success: false, message: 'Already registered' });

    const [result] = await pool.query('INSERT INTO registrations (event_id, user_id, status) VALUES (?, ?, ?)', [event_id, req.user.id, 'registered']);
    res.status(201).json({ success: true, data: { id: result.insertId, event_id, user_id: req.user.id, status: 'registered' } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Get my registrations
const getMyRegistrations = async (req, res) => {
  try {
    const [registrations] = await pool.query(`
      SELECT r.id as registration_id, r.status as registration_status, r.registered_at, e.* 
      FROM registrations r 
      JOIN events e ON r.event_id = e.id 
      WHERE r.user_id=?`, [req.user.id]);
    res.status(200).json({ success: true, data: registrations });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Cancel registration
const cancelRegistration = async (req, res) => {
  try {
    const [result] = await pool.query(
      'UPDATE registrations SET status=?, cancelled_at=CURRENT_TIMESTAMP WHERE id=? AND user_id=?',
      ['cancelled', req.params.id, req.user.id]
    );
    if (result.affectedRows === 0) return res.status(404).json({ success: false, message: 'Registration not found or unauthorized' });
    res.status(200).json({ success: true, data: { message: 'Registration cancelled' } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Get event registrations (Admin)
const getEventRegistrations = async (req, res) => {
  try {
    const [registrations] = await pool.query(`
      SELECT r.id, r.status, r.registered_at, u.id as user_id, u.name, u.email, u.department 
      FROM registrations r 
      JOIN users u ON r.user_id = u.id 
      WHERE r.event_id=?`, [req.params.eventId]);
    res.status(200).json({ success: true, data: registrations });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = { registerForEvent, getMyRegistrations, cancelRegistration, getEventRegistrations };
