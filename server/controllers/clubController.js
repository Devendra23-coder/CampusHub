const pool = require('../config/db');

// Get all clubs
const getAllClubs = async (req, res) => {
  try {
    const [clubs] = await pool.query('SELECT * FROM clubs ORDER BY created_at DESC');
    res.status(200).json({ success: true, data: clubs });
  } catch (err) {
    console.error('GetAllClubs error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Get single club by ID
const getClubById = async (req, res) => {
  try {
    const [clubs] = await pool.query('SELECT * FROM clubs WHERE id = ?', [req.params.id]);
    if (clubs.length === 0) return res.status(404).json({ success: false, message: 'Club not found' });
    res.status(200).json({ success: true, data: clubs[0] });
  } catch (err) {
    console.error('GetClubById error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Create a new club (Admin only)
const createClub = async (req, res) => {
  try {
    const { name, description, category, image_url, contact_email } = req.body;
    const [result] = await pool.query(
      'INSERT INTO clubs (name, description, category, image_url, contact_email, created_by) VALUES (?, ?, ?, ?, ?, ?)',
      [name, description, category, image_url || null, contact_email || null, req.user.id]
    );
    res.status(201).json({ success: true, data: { id: result.insertId, name, description, category } });
  } catch (err) {
    console.error('CreateClub error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Update a club (Admin only)
const updateClub = async (req, res) => {
  try {
    const { name, description, category, image_url, contact_email } = req.body;
    const [result] = await pool.query(
      'UPDATE clubs SET name=?, description=?, category=?, image_url=?, contact_email=? WHERE id=?',
      [name, description, category, image_url, contact_email, req.params.id]
    );
    if (result.affectedRows === 0) return res.status(404).json({ success: false, message: 'Club not found' });
    res.status(200).json({ success: true, data: { message: 'Club updated' } });
  } catch (err) {
    console.error('UpdateClub error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Delete a club (Admin only)
const deleteClub = async (req, res) => {
  try {
    const [result] = await pool.query('DELETE FROM clubs WHERE id = ?', [req.params.id]);
    if (result.affectedRows === 0) return res.status(404).json({ success: false, message: 'Club not found' });
    res.status(200).json({ success: true, data: { message: 'Club deleted' } });
  } catch (err) {
    console.error('DeleteClub error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

module.exports = { getAllClubs, getClubById, createClub, updateClub, deleteClub };
