const pool = require('../config/db');

// Register for event
const registerForEvent = async (req, res) => {
  try {
    const { event_id } = req.body;
    
    // Check event exists and get event details
    const [events] = await pool.query('SELECT * FROM events WHERE id=?', [event_id]);
    if (events.length === 0) return res.status(404).json({ success: false, message: 'Event not found' });
    const event = events[0];
    
    // Check space available
    const [regs] = await pool.query('SELECT COUNT(*) as count FROM registrations WHERE event_id=? AND status!=?', [event_id, 'cancelled']);
    if (event.max_participants && regs[0].count >= event.max_participants) {
      return res.status(400).json({ success: false, message: 'Event is full' });
    }

    // Check existing registration
const [existing] = await pool.query(
  'SELECT id, status FROM registrations WHERE event_id=? AND user_id=?',
  [event_id, req.user.id]
);

let registrationId;

if (existing.length > 0) {
  if (existing[0].status === 'registered') {
    return res.status(400).json({
      success: false,
      message: 'Already registered'
    });
  }

  // Re-register after cancellation
  registrationId = existing[0].id;

  await pool.query(
    `UPDATE registrations
     SET status='registered',
         cancelled_at=NULL,
         registered_at=CURRENT_TIMESTAMP
     WHERE id=?`,
    [registrationId]
  );
} else {
  // First-time registration
  const [result] = await pool.query(
    'INSERT INTO registrations (event_id, user_id, status) VALUES (?, ?, ?)',
    [event_id, req.user.id, 'registered']
  );

  registrationId = result.insertId;
}

    // Generate ticket_id: CH-YYYY-NNNNNN
    const year = new Date().getFullYear();
    const ticketId = `CH-${year}-${String(registrationId).padStart(6, '0')}`;
    await pool.query('UPDATE registrations SET ticket_id=? WHERE id=?', [ticketId, registrationId]);

    // Fetch student info for enriched response
    const [users] = await pool.query('SELECT id, name, email, department, year FROM users WHERE id=?', [req.user.id]);
    const student = users[0];

    // Fetch registration timestamp
    const [regRow] = await pool.query('SELECT registered_at FROM registrations WHERE id=?', [registrationId]);

    // Build enriched response data for PDF ticket generation
    const ticketData = {
      id: registrationId,
      ticket_id: ticketId,
      event_id: Number(event_id),
      user_id: req.user.id,
      status: 'registered',
      registered_at: regRow[0].registered_at,
      // Event info
      event_title: event.title,
      event_description: event.description,
      event_date: event.event_date,
      end_date: event.end_date,
      event_location: event.location,
      event_category: event.category,
      // Student info
      student_name: student.name,
      student_email: student.email,
      student_department: student.department,
      student_year: student.year
    };

    // Create persistent notification for admins
    const notifTitle = 'New Event Registration';
    const notifMessage = `${student.name} registered for "${event.title}"`;
    const [notifResult] = await pool.query(
      'INSERT INTO notifications (type, title, message, registration_id, event_id) VALUES (?, ?, ?, ?, ?)',
      ['registration', notifTitle, notifMessage, registrationId, event_id]
    );

    // Emit real-time notification to all connected admins via Socket.IO
    const io = req.app.get('io');
    if (io) {
      io.to('admin').emit('new_registration', {
        id: notifResult.insertId,
        type: 'registration',
        title: notifTitle,
        message: notifMessage,
        registration_id: registrationId,
        ticket_id: ticketId,
        student_name: student.name,
        event_id: Number(event_id),
        event_title: event.title,
        is_read: 0,
        created_at: new Date().toISOString()
      });
    }

    res.status(201).json({ success: true, data: ticketData });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Get my registrations
const getMyRegistrations = async (req, res) => {
  try {
    const [registrations] = await pool.query(`
      SELECT r.id as registration_id, r.ticket_id, r.status as registration_status, r.registered_at, e.* 
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
      SELECT r.id, r.ticket_id, r.status, r.registered_at, u.id as user_id, u.name, u.email, u.department 
      FROM registrations r 
      JOIN users u ON r.user_id = u.id 
      WHERE r.event_id=?`, [req.params.eventId]);
    res.status(200).json({ success: true, data: registrations });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = { registerForEvent, getMyRegistrations, cancelRegistration, getEventRegistrations };
