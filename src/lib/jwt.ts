
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET!

export type JwtPayload = {
  userId: string;
  email: string;
  role: "student" | "organizer" | "admin";
};

if (!JWT_SECRET) {
  throw new Error('JWT_SECRET is missing')
}

export function signToken(payload: JwtPayload) {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: '7d',
  })
}

export function verifyToken(token: string) {
  return jwt.verify(token, JWT_SECRET) as JwtPayload;
}
