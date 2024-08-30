import express from 'express';
import passport from 'passport';
import { JWTConfig } from '../config/jwt.config';
import { signInWithEmailPassword, signUpWithEmailPassword } from '../controllers/auth.controller';
import { validateSchema } from '../config/zod.config';
import { loginSchema, registerSchema } from '../schemas/auth.schema';

const router = express.Router();

// Email Auth
router.post('/register', validateSchema(registerSchema), signUpWithEmailPassword);
router.post('/login', validateSchema(loginSchema), signInWithEmailPassword);

router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
router.get('/google/callback', passport.authenticate('google', { session: false }), (req, res) => {
	if (req.user) {
		const token = JWTConfig.generate(req.user as any);

		res.cookie('token', token);
		res.redirect('/');
	}
});

// router.get('/facebook', passport.authenticate('facebook', { scope: ['email'] }));
// router.get('/facebook/callback', passport.authenticate('facebook', { session: false }), (req, res) => {
// 	// Successful authentication, send token to the client
// 	const { token } = req.user as any;
// 	res.json({ token });
// });

router.get('/github', passport.authenticate('github', { scope: ['user:email'] }));
router.get('/github/callback', passport.authenticate('github', { session: false }), (req, res) => {
	// Successful authentication, send token to the client
	const { token } = req.user as any;
	res.json({ token });
});

// router.get('/apple', passport.authenticate('apple'));
// router.post('/apple/callback', passport.authenticate('apple', { session: false }), (req, res) => {
// 	// Successful authentication, send token to the client
// 	const { token } = req.user as any;
// 	res.json({ token });
// });

router.post('/roles');

export default router;
