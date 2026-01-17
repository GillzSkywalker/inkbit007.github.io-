const express = require('express');
const router = express.Router();
const passport = require('passport');
const User = require('../models/user');
const { OAuth2Client } = require('google-auth-library');

// Initialize Google OAuth client
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
console.log('Google Client ID:', process.env.GOOGLE_CLIENT_ID);

// Google Sign-In via token verification
router.post('/google', async (req, res) => {
  console.log('Google auth request received:', req.body);
  try {
    const { token } = req.body;

    if (!token) {
      console.log('No token provided');
      return res.status(400).json({ error: 'Token is required', success: false });
    }

    console.log('Verifying token with Google...');
    // Verify the token with Google
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID
    });

    const payload = ticket.getPayload();
    console.log('Token verified, payload:', { sub: payload.sub, email: payload.email, name: payload.name });
    const { sub: googleId, email, name, picture } = payload;

    // Find or create user
    let user = await User.findOne({ googleId });
    console.log('Existing user found:', !!user);

    if (!user) {
      user = new User({
        googleId,
        name: name || email,
        email,
        picture: picture || null,
        authMethod: 'google'
      });
      await user.save();
      console.log('New user created:', user._id);
    }

    // Create session
    req.login(user, (err) => {
      if (err) {
        console.log('Session creation error:', err);
        return res.status(500).json({ error: 'Login failed', success: false });
      }
      console.log('Session created successfully for user:', user._id);
      res.json({ 
        success: true, 
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          googleId: user.googleId,
          location: user.location
        }
      });
    });
  } catch (error) {
    console.error('Google auth error:', error);
    res.status(401).json({ error: 'Invalid token', success: false });
  }
});

// Traditional login with email/password
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password are required' });
    }

    // Find user by email or username
    const user = await User.findOne({
      $or: [{ email: username }, { name: username }]
    });

    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Check password
    const bcrypt = require('bcryptjs');
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Create session
    req.login(user, (err) => {
      if (err) {
        return res.status(500).json({ error: 'Login failed' });
      }
      res.json({ 
        success: true, 
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          location: user.location
        }
      });
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Logout
router.post('/logout', (req, res) => {
  req.logout((err) => {
    if (err) {
      return res.status(500).json({ error: 'Logout failed' });
    }
    res.json({ success: true, message: 'Logged out successfully' });
  });
});

// Get current user
router.get('/me', (req, res) => {
  if (!req.user) {
    return res.status(401).json({ error: 'Not authenticated' });
  }
  const userObj = req.user.toObject();
  delete userObj.password;
  res.json(userObj);
});

// Google OAuth callback (if using server-side flow)
router.get('/google/callback', 
  passport.authenticate('google', { failureRedirect: '/landing/login.html' }),
  (req, res) => {
    res.redirect('/landing/index.html');
  }
);

module.exports = router;
