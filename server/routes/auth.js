const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../database/db');

// Signup
router.post('/signup', async (req, res) => {
  const { name, email, password, rollNo, role } = req.body;

  if (!name || !email || !password || !rollNo || !role) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  if (role !== 'teacher' && role !== 'student') {
    return res.status(400).json({ message: 'Invalid role' });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    
    db.run(
      `INSERT INTO users (name, email, password, rollNo, role) VALUES (?, ?, ?, ?, ?)`,
      [name, email, hashedPassword, rollNo, role],
      function(err) {
        if (err) {
          if (err.message.includes('UNIQUE constraint failed')) {
            return res.status(400).json({ message: 'Email already exists' });
          }
          return res.status(500).json({ message: 'Error registering user', error: err.message });
        }
        
        // Generate token for auto-login
        const token = jwt.sign(
          { id: this.lastID, email, role, name, rollNo },
          process.env.JWT_SECRET || 'supersecretjwtkey_for_smart_attendance',
          { expiresIn: '24h' }
        );

        res.status(201).json({ 
          message: 'User created successfully',
          token,
          user: { id: this.lastID, name, email, rollNo, role }
        });
      }
    );
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Login
router.post('/login', (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  db.get(`SELECT * FROM users WHERE email = ?`, [email], async (err, user) => {
    if (err) {
      return res.status(500).json({ message: 'Database error', error: err.message });
    }
    
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role, name: user.name, rollNo: user.rollNo },
      process.env.JWT_SECRET || 'supersecretjwtkey_for_smart_attendance',
      { expiresIn: '24h' }
    );

    res.json({
      message: 'Logged in successfully',
      token,
      user: { id: user.id, name: user.name, email: user.email, rollNo: user.rollNo, role: user.role }
    });
  });
});

module.exports = router;
