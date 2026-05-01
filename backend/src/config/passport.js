import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Strategy as GitHubStrategy } from 'passport-github2';
import User from '../features/auth/auth.model.js';
import dotenv from 'dotenv';

dotenv.config();

const configurePassport = () => {
    // Google Strategy
    passport.use(new GoogleStrategy({
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: `${process.env.BACKEND_URL}/auth/google/callback`,
        proxy: true
    }, async (accessToken, refreshToken, profile, done) => {
        try {
            console.log('Google Profile:', profile.id, profile.emails[0]?.value);
            const email = profile.emails[0].value;
            let user = await User.findOne({ 
                $or: [
                    { googleId: profile.id },
                    { email: email }
                ]
            });

            if (!user) {
                // Create new user
                const baseUsername = email.split('@')[0].substring(0, 15);
                user = await User.create({
                    name: profile.displayName || 'Google User',
                    email: email,
                    username: (baseUsername.length >= 5 ? baseUsername : baseUsername + Math.floor(1000 + Math.random() * 9000)).toLowerCase(),
                    googleId: profile.id,
                    provider: 'google',
                    profilePicture: profile.photos[0]?.value || ''
                });
            } else {
                // Update existing user if needed
                if (!user.googleId) {
                    user.googleId = profile.id;
                    user.provider = 'google'; // Mark as google provider if they switch
                }
                if (!user.profilePicture) {
                    user.profilePicture = profile.photos[0]?.value || '';
                }
                await user.save();
            }

            return done(null, user);
        } catch (error) {
            console.error('Google Auth Error:', error);
            return done(error, null);
        }
    }));

    // GitHub Strategy
    passport.use(new GitHubStrategy({
        clientID: process.env.GITHUB_CLIENT_ID,
        clientSecret: process.env.GITHUB_CLIENT_SECRET,
        callbackURL: `${process.env.BACKEND_URL}/auth/github/callback`,
        proxy: true
    }, async (accessToken, refreshToken, profile, done) => {
        try {
            console.log('GitHub Profile:', profile.id, profile.username);
            const email = (profile.emails && profile.emails[0]) ? profile.emails[0].value : `${profile.username}@github.com`;
            let user = await User.findOne({ 
                $or: [
                    { githubId: profile.id },
                    { email: email }
                ]
            });

            if (!user) {
                const githubUsername = profile.username || `gh_${profile.id}`;
                user = await User.create({
                    name: profile.displayName || profile.username || 'GitHub User',
                    email: email,
                    username: (githubUsername.length >= 5 ? githubUsername : githubUsername + "_" + Math.floor(100 + Math.random() * 899)).substring(0, 20).toLowerCase(),
                    githubId: profile.id,
                    provider: 'github',
                    profilePicture: (profile.photos && profile.photos[0]) ? profile.photos[0].value : ''
                });
            } else {
                if (!user.githubId) {
                    user.githubId = profile.id;
                    user.provider = 'github';
                }
                if (!user.profilePicture && profile.photos && profile.photos[0]) {
                    user.profilePicture = profile.photos[0].value;
                }
                await user.save();
            }

            return done(null, user);
        } catch (error) {
            console.error('GitHub Auth Error:', error);
            return done(error, null);
        }
    }));

    passport.serializeUser((user, done) => {
        done(null, user.id);
    });

    passport.deserializeUser(async (id, done) => {
        try {
            const user = await User.findById(id);
            done(null, user);
        } catch (error) {
            done(error, null);
        }
    });
};

export default configurePassport;
