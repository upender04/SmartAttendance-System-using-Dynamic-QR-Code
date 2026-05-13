require('dotenv').config();
const express = require('express');
const cors = require('cors');

const authRoutes = require('./routes/auth');
const teacherRoutes = require('./routes/teacher');
const studentRoutes = require('./routes/student');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api', teacherRoutes); // includes /session and /attendance
app.use('/api', studentRoutes); // includes /attendance

app.get('/', (req, res) => {
  res.send('Smart Attendance System API is running...');
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!', error: err.message });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
