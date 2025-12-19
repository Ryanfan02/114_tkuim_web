// server/utils/generateToken.js
import jwt from 'jsonwebtoken';

const EXPIRES_IN = '2h';

export function generateToken(user) {
  return jwt.sign(
    {
      sub: user._id.toString(),
      email: user.email,
      role: user.role
    },
    process.env.JWT_SECRET,
    { expiresIn: EXPIRES_IN }
  );
}
