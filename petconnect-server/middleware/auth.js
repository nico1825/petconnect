const jwt = require('jsonwebtoken');

exports.authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;
  console.log('🔐 Incoming Auth Header:', req.headers.authorization);

  if (!authHeader) {
    console.log('⛔ No auth header');
    return res.status(401).json({ error: 'No token provided' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('✅ Token decoded:', decoded);

    req.userId = decoded.userId;
    console.log('✅ User authenticated:', req.userId);
    next();
  } catch (err) {
    console.error('❌ Token verification failed:', err);
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
};

