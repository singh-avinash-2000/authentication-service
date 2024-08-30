import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
// import { Strategy as FacebookStrategy } from 'passport-facebook';
import { Strategy as GitHubStrategy, Profile as GitHubProfile } from 'passport-github2';
// import { Strategy as AppleStrategy } from 'passport-apple';
import prisma from './prisma.config';
import { User } from '@prisma/client';

enum ProfileTypes {
	Google = 'google_id',
	Facebook = 'facebook_id',
	Apple = 'apple_id',
	Github = 'github_id',
}

async function getUserOrCreateByProfile(profileType: ProfileTypes, profileId: string, firstName: string, middleName: string | undefined, lastName: string, email: string): Promise<User> {
	let user = await prisma.user.findFirst({
		where: {
			[profileType]: profileId,
		},
	});

	if (!user) {
		user = await prisma.user.create({
			data: {
				first_name: firstName,
				middle_name: middleName,
				last_name: lastName,
				email: email,
				google_id: profileId,
			},
		});
	}

	return user;
}

// Google Strategy
passport.use(
	new GoogleStrategy(
		{
			clientID: process.env.GOOGLE_CLIENT_ID!,
			clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
			callbackURL: '/auth/google/callback',
		},
		async (_accessToken, _refreshToken, profile, done) => {
			try {
				const user = await getUserOrCreateByProfile(ProfileTypes.Google, profile.id, profile.name?.givenName ?? '', profile.name?.middleName, profile.name?.familyName ?? '', profile._json.email ?? '');
				return done(null, user);
			} catch (err) {
				return done(err, false);
			}
		}
	)
);

// Facebook Strategy
// passport.use(
// 	new FacebookStrategy(
// 		{
// 			clientID: process.env.FACEBOOK_CLIENT_ID!,
// 			clientSecret: process.env.FACEBOOK_CLIENT_SECRET!,
// 			callbackURL: '/auth/facebook/callback',
// 		},
// 		async (accessToken, refreshToken, profile, done) => {
// 			try {
// 				let user = await User.findOne({ facebookId: profile.id });

// 				if (!user) {
// 					user = await User.create({ facebookId: profile.id, name: profile.displayName });
// 				}

// 				const token = generateToken(user);
// 				return done(null, { user, token });
// 			} catch (err) {
// 				return done(err, false);
// 			}
// 		}
// 	)
// );

// GitHub Strategy
passport.use(
	new GitHubStrategy(
		{
			clientID: process.env.GITHUB_CLIENT_ID!,
			clientSecret: process.env.GITHUB_CLIENT_SECRET!,
			callbackURL: '/auth/github/callback',
			scope: ['user:email'],
		},
		async (_accessToken: string, _refreshToken: string, profile: GitHubProfile, done: any) => {
			try {
				console.log(profile);
				return done(null, {});
			} catch (err) {
				return done(err, false);
			}
		}
	)
);

// // Apple Strategy
// passport.use(
// 	new AppleStrategy(
// 		{
// 			clientID: process.env.APPLE_CLIENT_ID!,
// 			teamID: process.env.APPLE_TEAM_ID!,
// 			keyID: process.env.APPLE_KEY_ID!,
// 			privateKeyString: process.env.APPLE_PRIVATE_KEY!,
// 			callbackURL: '/auth/apple/callback',
// 		},
// 		async (accessToken, refreshToken, idToken, profile, done) => {
// 			try {
// 				let user = await User.findOne({ appleId: profile.id });

// 				if (!user) {
// 					user = await User.create({ appleId: profile.id, name: profile.displayName });
// 				}

// 				const token = generateToken(user);
// 				return done(null, { user, token });
// 			} catch (err) {
// 				return done(err, false);
// 			}
// 		}
// 	)
// );
