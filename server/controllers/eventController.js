const pool = require('../config/db');

// Get all events
const getAllEvents = async (req, res) => {
  try {
    const { category, status } = req.query;
    let query = 'SELECT * FROM events WHERE 1=1';
    let params = [];
    
    if (category) {
      query += ' AND category = ?';
      params.push(category);
    }
    if (status) {
      query += ' AND status = ?';
      params.push(status);
    }
    query += ' ORDER BY event_date ASC';

    const [events] = await pool.query(query, params);
    res.status(200).json({ success: true, data: events });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Get single event
const getEventById = async (req, res) => {
  try {
    const [events] = await pool.query(`
      SELECT e.*, COUNT(r.id) as registrations_count 
      FROM events e 
      LEFT JOIN registrations r ON e.id = r.event_id AND r.status != 'cancelled'
      WHERE e.id = ? GROUP BY e.id`, [req.params.id]);
      
    if (events.length === 0) return res.status(404).json({ success: false, message: 'Event not found' });
    res.status(200).json({ success: true, data: events[0] });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Create event
const createEvent = async (req, res) => {
  try {
    const { title, description, event_date, location, category, max_participants, image_url } = req.body;
    const [result] = await pool.query(
      'INSERT INTO events (title, description, event_date, location, category, max_participants, image_url, created_by) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [title, description, event_date, location, category, max_participants, image_url, req.user.id]
    );
    res.status(201).json({ success: true, data: { id: result.insertId, title, description, event_date, location, category, max_participants, image_url } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Update event
const updateEvent = async (req, res) => {
  try {
    const { title, description, event_date, location, category, max_participants, image_url, status } = req.body;
    const [result] = await pool.query(
      'UPDATE events SET title=?, description=?, event_date=?, location=?, category=?, max_participants=?, image_url=?, status=? WHERE id=?',
      [title, description, event_date, location, category, max_participants, image_url, status, req.params.id]
    );
    if (result.affectedRows === 0) return res.status(404).json({ success: false, message: 'Event not found' });
    res.status(200).json({ success: true, data: { message: 'Event updated' } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Delete event
const deleteEvent = async (req, res) => {
  try {
    const [result] = await pool.query('DELETE FROM events WHERE id=?', [req.params.id]);
    if (result.affectedRows === 0) return res.status(404).json({ success: false, message: 'Event not found' });
    res.status(200).json({ success: true, data: { message: 'Event deleted' } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = { getAllEvents, getEventById, createEvent, updateEvent, deleteEvent };
