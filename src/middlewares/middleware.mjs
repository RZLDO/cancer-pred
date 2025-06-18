import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

function authenticate(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      error: true,
      message: 'Unauthorized: Missing or malformed token',
    });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({
      error: true,
      message: 'Unauthorized: Invalid or expired token',
    });
  }
}

export default authenticate;
