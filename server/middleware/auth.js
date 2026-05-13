const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
  const token = req.headers['authorization'];

  if (!token) {
    return res.status(403).json({ message: 'A token is required for authentication' });
  }

  try {
    const tokenStr = token.replace('Bearer ', '');
    const decoded = jwt.verify(tokenStr, process.env.JWT_SECRET || 'supersecretjwtkey_for_smart_attendance');
    req.user = decoded;
  } catch (err) {
    return res.status(401).json({ message: 'Invalid Token' });
  }
  return next();
};

const isTeacher = (req, res, next) => {
  if (req.user && req.user.role === 'teacher') {
    return next();
  }
  return res.status(403).json({ message: 'Require Teacher Role!' });
};

const isStudent = (req, res, next) => {
  if (req.user && req.user.role === 'student') {
    return next();
  }
  return res.status(403).json({ message: 'Require Student Role!' });
};

module.exports = { verifyToken, isTeacher, isStudent };
