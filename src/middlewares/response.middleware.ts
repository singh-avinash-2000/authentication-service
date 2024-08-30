import { NextFunction, Request, Response } from 'express';
import { ResponseStructure } from '../types/response.types';

// Extend the Response object to include custom success and error methods
declare module 'express-serve-static-core' {
	interface Response {
		success: (params: ResponseStructure) => void;
		error: (params: ResponseStructure) => void;
	}
}

export const responseMiddleware = function (_req: Request, res: Response, next: NextFunction) {
	res.success = function ({ result = [], code = 200, message = 'Success' }) {
		res.status(code).send({
			result,
			message,
		});
	};

	res.error = function ({ error = {}, code = 400, message = 'Server encountered a bad request' }) {
		res.status(code).send({
			error,
			message,
		});
	};

	next();
};
