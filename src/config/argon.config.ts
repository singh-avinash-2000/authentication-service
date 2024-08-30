import argon2 from 'argon2';

export const hashPassword = async (plainPassword: string): Promise<string> => {
	return await argon2.hash(plainPassword, {
		type: argon2.argon2id,
		memoryCost: 2 ** 13, // 8MB
		timeCost: 3, // Number of iterations
		parallelism: 1, // Single thread
	});
};

export const verifyPassword = async (hash: string, plainPassword: string): Promise<boolean> => {
	return await argon2.verify(hash, plainPassword);
};
