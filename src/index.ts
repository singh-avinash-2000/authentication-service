import express, { Request, Response } from 'express';
import './config/auth.config';
import passport from 'passport';
import authRoutes from './routes/auth.routes';
import { responseMiddleware } from './middlewares/response.middleware';
import { errorHandler } from './middlewares/error.middleware';

const app = express();

// Middlewares
app.use(express.json());
app.use(passport.initialize());
app.use(responseMiddleware);
app.use(express.json({ limit: '25mb' }));
app.use(express.urlencoded({ extended: false }));

app.use(errorHandler);

// Routes
app.use('/auth', authRoutes);

app.get('/', async (_req: Request, res: Response) => {
	return res.send({
		user: _req.user,
	});
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
	console.log(`Server is running on http://localhost:${port}`);
});
