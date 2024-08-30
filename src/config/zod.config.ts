import { Request, Response, NextFunction } from 'express';
import { ZodSchema } from 'zod';

export const validateSchema = (schema: ZodSchema<any>) => {
	return (req: Request, res: Response, next: NextFunction) => {
		const result = schema.safeParse(req.body);
		if (!result.success) {
			return res.error({
				code: 400,
				message: 'Request schema validation failed',
				error: result.error.errors,
			});
		}
		next();
	};
};
