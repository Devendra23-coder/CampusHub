const pool = require('../config/db');

// Get current user profile
const getProfile = async (req, res) => {
  try {
    const [users] = await pool.query(
      'SELECT id, name, email, role, phone, department, year, avatar_url, created_at FROM users WHERE id = ?',
      [req.user.id]
    );
    if (users.length === 0) return res.status(404).json({ success: false, message: 'User not found' });
    res.status(200).json({ success: true, data: users[0] });
  } catch (err) {
    console.error('GetProfile error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Update own profile
const updateProfile = async (req, res) => {
  try {
    const { name, phone, department, year, avatar_url } = req.body;
    await pool.query(
      'UPDATE users SET name=?, phone=?, department=?, year=?, avatar_url=? WHERE id=?',
      [name, phone, department, year, avatar_url, req.user.id]
    );
    res.status(200).json({ success: true, data: { message: 'Profile updated' } });
  } catch (err) {
    console.error('UpdateProfile error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Get all users (Admin only)
const getAllUsers = async (req, res) => {
  try {
    const [users] = await pool.query(
      'SELECT id, name, email, role, phone, department, year, created_at FROM users ORDER BY created_at DESC'
    );
    res.status(200).json({ success: true, data: users });
  } catch (err) {
    console.error('GetAllUsers error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Delete a user (Admin only)
const deleteUser = async (req, res) => {
  try {
    const [result] = await pool.query('DELETE FROM users WHERE id = ?', [req.params.id]);
    if (result.affectedRows === 0) return res.status(404).json({ success: false, message: 'User not found' });
    res.status(200).json({ success: true, data: { message: 'User deleted' } });
  } catch (err) {
    console.error('DeleteUser error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

module.exports = { getProfile, updateProfile, getAllUsers, deleteUser };
