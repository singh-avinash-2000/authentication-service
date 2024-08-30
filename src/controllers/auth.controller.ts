import { Request, Response } from 'express';
import expressAsyncHandler from 'express-async-handler';
import prisma from '../config/prisma.config';
import { ResponseStructure } from '../types/response.types';
import { JWTConfig } from '../config/jwt.config';
import { verifyPassword } from '../config/argon.config';
import { hashPassword } from '../config/argon.config';

export const signInWithEmailPassword = expressAsyncHandler(async (req: Request, res: Response) => {
	let responseObject: ResponseStructure = {
		code: 200,
		message: 'Successfully logged in',
	};

	const { email, password } = req.body;

	const user = await prisma.user.findFirst({ where: { email: email.trim().toLowerCase() } });

	if (!user) {
		responseObject.code = 404;
		responseObject.message = 'User not found';

		return res.success(responseObject);
	}

	const isPasswordCorrect = await verifyPassword(user.password_hash ?? '', password);
	if (isPasswordCorrect) {
		const accessToken = JWTConfig.generate(user, '15m');
		const refreshToken = JWTConfig.generate(user, '8h');

		res.cookie('jwt', refreshToken, {
			httpOnly: true,
			secure: true,
			sameSite: 'none',
		});

		responseObject.result = { accessToken };
		return res.success(responseObject);
	} else {
		responseObject.message = 'Wrong password';
		return res.error(responseObject);
	}
});

export const signUpWithEmailPassword = expressAsyncHandler(async (req: Request, res: Response) => {
	let responseObject: ResponseStructure = {
		code: 200,
		message: '',
	};

	const requestBody = req.body;
	let user = await prisma.user.findFirst({ where: { email: requestBody.email.trim().toLowerCase() } });

	if (user) {
		responseObject.code = 403;
		responseObject.message = 'This email is already registered, please try logging in!';

		return res.error(responseObject);
	}

	const hashedPassword = await hashPassword(requestBody.password);
	let result = await prisma.user.create({
		data: {
			first_name: '',
			last_name: '',
			email: requestBody.email,
			password_hash: hashedPassword,
		},
	});

	responseObject.message = 'You have successfully registered!';

	const accessToken = JWTConfig.generate(result, '15m');
	const refreshToken = JWTConfig.generate(result, '8h');

	res.cookie('jwt', refreshToken, {
		httpOnly: true,
		secure: true,
		sameSite: 'none',
	});

	responseObject.result = { accessToken };
	return res.success(responseObject);
});

export const addRoles = expressAsyncHandler(async (req: Request, res: Response) => {
	if (true) {
		res.error({
			code: 403,
			message: "You don't have appropreiate permission",
		});
	}
	const roles = req.body.roles;

	await prisma.role.createMany({ data: roles });
});
