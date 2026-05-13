const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const bcrypt = require('bcrypt');

const dbPath = path.resolve(__dirname, 'attendance.db');

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error opening database', err.message);
  } else {
    console.log('Connected to the SQLite database.');
    
    db.serialize(() => {
      // Create Users table
      db.run(`CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        rollNo TEXT,
        role TEXT NOT NULL CHECK(role IN ('teacher', 'student')),
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )`);

      // Add rollNo column if it doesn't exist (migration)
      db.run(`PRAGMA table_info(users)`, (err, rows) => {
        if (!rows || !rows.find(col => col.name === 'rollNo')) {
          db.run(`ALTER TABLE users ADD COLUMN rollNo TEXT`, (err) => {
            if (err && !err.message.includes('duplicate column')) {
              console.log('Added rollNo column to users table');
            }
          });
        }
      });

      // Create Sessions table
      db.run(`CREATE TABLE IF NOT EXISTS sessions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        teacher_id INTEGER NOT NULL,
        subject TEXT NOT NULL,
        session_code TEXT UNIQUE NOT NULL,
        is_active BOOLEAN DEFAULT 1,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (teacher_id) REFERENCES users(id)
      )`);

      // Create Attendance table
      db.run(`CREATE TABLE IF NOT EXISTS attendance (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        session_id INTEGER NOT NULL,
        student_id INTEGER NOT NULL,
        timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(session_id, student_id),
        FOREIGN KEY (session_id) REFERENCES sessions(id),
        FOREIGN KEY (student_id) REFERENCES users(id)
      )`);

      // Seed default accounts if they don't exist
      const seedUsers = async () => {
        const teacherPassword = await bcrypt.hash('Teacher123', 10);
        const studentPassword = await bcrypt.hash('Student123', 10);

        db.get("SELECT id FROM users WHERE email = ?", ['teacher@test.com'], (err, row) => {
          if (!row) {
            db.run(`INSERT INTO users (name, email, password, rollNo, role) VALUES (?, ?, ?, ?, ?)`, 
              ['Test Teacher', 'teacher@test.com', teacherPassword, 'T001', 'teacher']);
            console.log('Test Teacher seeded.');
          }
        });

        db.get("SELECT id FROM users WHERE email = ?", ['student@test.com'], (err, row) => {
          if (!row) {
            db.run(`INSERT INTO users (name, email, password, rollNo, role) VALUES (?, ?, ?, ?, ?)`, 
              ['Test Student', 'student@test.com', studentPassword, 'S001', 'student']);
            console.log('Test Student seeded.');
          }
        });
      };
      
      seedUsers();
    });
  }
});

module.exports = db;
