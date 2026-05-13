const express = require('express');
const router = express.Router();
const db = require('../database/db');
const { verifyToken, isTeacher } = require('../middleware/auth');
const crypto = require('crypto');

// Apply middleware to all routes
router.use(verifyToken, isTeacher);

// Create session
router.post('/session/create', (req, res) => {
  const { subject } = req.body;
  const teacherId = req.user.id;

  if (!subject) {
    return res.status(400).json({ message: 'Subject is required' });
  }

  // Generate a unique session code
  const sessionCode = crypto.randomBytes(4).toString('hex').toUpperCase();

  db.run(
    `INSERT INTO sessions (teacher_id, subject, session_code) VALUES (?, ?, ?)`,
    [teacherId, subject, sessionCode],
    function(err) {
      if (err) {
        return res.status(500).json({ message: 'Error creating session', error: err.message });
      }
      res.status(201).json({
        message: 'Session created successfully',
        session: {
          id: this.lastID,
          teacher_id: teacherId,
          subject,
          session_code: sessionCode,
          is_active: 1
        }
      });
    }
  );
});

// Get active sessions for teacher
router.get('/session/active', (req, res) => {
  const teacherId = req.user.id;

  db.all(
    `SELECT * FROM sessions WHERE teacher_id = ? AND is_active = 1`,
    [teacherId],
    (err, rows) => {
      if (err) {
        return res.status(500).json({ message: 'Error fetching sessions', error: err.message });
      }
      res.json(rows);
    }
  );
});

// End session
router.post('/session/end', (req, res) => {
  const { sessionId } = req.body;
  const teacherId = req.user.id;

  if (!sessionId) {
    return res.status(400).json({ message: 'Session ID is required' });
  }

  db.run(
    `UPDATE sessions SET is_active = 0 WHERE id = ? AND teacher_id = ?`,
    [sessionId, teacherId],
    function(err) {
      if (err) {
        return res.status(500).json({ message: 'Error ending session', error: err.message });
      }
      if (this.changes === 0) {
        return res.status(404).json({ message: 'Active session not found or unauthorized' });
      }
      res.json({ message: 'Session ended successfully' });
    }
  );
});

// Get all attendance history for a teacher
router.get('/attendance/all', (req, res) => {
  const teacherId = req.user.id;

  const query = `
    SELECT 
      s.id as session_id, s.subject, s.created_at as session_date,
      u.name as student_name, u.email as student_email,
      a.timestamp as attendance_time
    FROM sessions s
    LEFT JOIN attendance a ON s.id = a.session_id
    LEFT JOIN users u ON a.student_id = u.id
    WHERE s.teacher_id = ?
    ORDER BY s.created_at DESC, a.timestamp DESC
  `;

  db.all(query, [teacherId], (err, rows) => {
    if (err) {
      return res.status(500).json({ message: 'Error fetching attendance', error: err.message });
    }
    res.json(rows);
  });
});

// Get detailed attendance for a specific session
router.get('/attendance/session/:sessionId', (req, res) => {
  const teacherId = req.user.id;
  const { sessionId } = req.params;

  // First verify the session belongs to the teacher
  db.get(`SELECT id FROM sessions WHERE id = ? AND teacher_id = ?`, [sessionId, teacherId], (err, session) => {
    if (err) return res.status(500).json({ message: 'Database error', error: err.message });
    if (!session) return res.status(404).json({ message: 'Session not found or unauthorized' });

    const query = `
      SELECT u.id, u.name, u.email, a.timestamp 
      FROM attendance a
      JOIN users u ON a.student_id = u.id
      WHERE a.session_id = ?
      ORDER BY a.timestamp DESC
    `;

    db.all(query, [sessionId], (err, rows) => {
      if (err) return res.status(500).json({ message: 'Error fetching attendance', error: err.message });
      res.json(rows);
    });
  });
});

module.exports = router;
