
import jwt from 'jsonwebtoken';
import { UserDocument } from '../models/User';

import { env } from '../config/env';

import { JwtPayload } from '../types/user';

// JWT secret key (should be in environment variables in production
const JWT_SECRET = env.JWT_SECRET;

export function getToken(user: UserDocument): string {
    const token = jwt.sign(
        { userId: user._id, email: user.email, role: user.role, profilePic: user.profilePic },
        JWT_SECRET,
        { expiresIn: '7d' }
    );
    return token;
}

export function verifyToken(token: string): Promise<JwtPayload> {
    return new Promise((resolve, reject) => {
        jwt.verify(token, JWT_SECRET, (err, decoded) => {
            if (err) {
                reject(err);
            } else {
                resolve(decoded as JwtPayload);
            }
        });
    });
}