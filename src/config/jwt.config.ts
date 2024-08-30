import { User } from '@prisma/client';
import jwt from 'jsonwebtoken';

export class JWTConfig {
	public static generate(user: User, expiresIn: string = '30m') {
		return jwt.sign({ id: user.id }, process.env.JWT_SECRET || 'mysecretkey', {
			expiresIn,
		});
	}
}
