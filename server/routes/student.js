const express = require('express');
const router = express.Router();
const db = require('../database/db');
const { verifyToken, isStudent } = require('../middleware/auth');

// Apply middleware to all routes
router.use(verifyToken, isStudent);

// Mark attendance
router.post('/attendance/mark', (req, res) => {
  const { sessionCode } = req.body;
  const studentId = req.user.id;

  if (!sessionCode) {
    return res.status(400).json({ message: 'Session code is required' });
  }

  // Find active session with this code
  db.get(
    `SELECT id, is_active FROM sessions WHERE session_code = ?`,
    [sessionCode],
    (err, session) => {
      if (err) {
        return res.status(500).json({ message: 'Database error', error: err.message });
      }

      if (!session) {
        return res.status(404).json({ message: 'Invalid session code' });
      }

      if (session.is_active === 0) {
        return res.status(400).json({ message: 'This session has ended' });
      }

      // Mark attendance
      db.run(
        `INSERT INTO attendance (session_id, student_id) VALUES (?, ?)`,
        [session.id, studentId],
        function(err) {
          if (err) {
            if (err.message.includes('UNIQUE constraint failed')) {
              return res.status(400).json({ message: 'Attendance already marked for this session' });
            }
            return res.status(500).json({ message: 'Error marking attendance', error: err.message });
          }

          res.status(201).json({ message: 'Attendance marked successfully' });
        }
      );
    }
  );
});

// Get attendance history for student
router.get('/attendance/history', (req, res) => {
  const studentId = req.user.id;

  const query = `
    SELECT 
      a.timestamp, 
      s.subject, 
      s.created_at as session_date,
      u.name as teacher_name
    FROM attendance a
    JOIN sessions s ON a.session_id = s.id
    JOIN users u ON s.teacher_id = u.id
    WHERE a.student_id = ?
    ORDER BY a.timestamp DESC
  `;

  db.all(query, [studentId], (err, rows) => {
    if (err) {
      return res.status(500).json({ message: 'Error fetching history', error: err.message });
    }
    
    // Also calculate attendance percentage
    // This is a simplistic calculation: total attended / total sessions created by all teachers they have attended at least one class of
    // A better approach for a real app would be mapping students to specific subjects/classes
    res.json(rows);
  });
});

// Get basic stats for student dashboard
router.get('/attendance/stats', (req, res) => {
  const studentId = req.user.id;

  const query = `
    SELECT COUNT(*) as total_attended
    FROM attendance
    WHERE student_id = ?
  `;

  db.get(query, [studentId], (err, row) => {
    if (err) return res.status(500).json({ message: 'Error fetching stats', error: err.message });
    res.json({ totalAttended: row ? row.total_attended : 0 });
  });
});

module.exports = router;
