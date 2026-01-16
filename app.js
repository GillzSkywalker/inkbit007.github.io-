const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const passport = require('passport');
const session = require('express-session');
const errorHandler = require('./middleware/errorHandler');
const authMiddleware = require('./middleware/auth');
require('dotenv').config();
require('./passport-config');

// Security & helper middleware
const helmet = require('helmet');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');


const app = express();
const port = process.env.PORT || 3000;

// inside app.js


// Basic middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(helmet());
app.use(cors({ origin: true, credentials: true }));
app.use(morgan('dev'));

// Rate limiter (basic)
const limiter = rateLimit({ windowMs: 1 * 60 * 1000, max: 100 });
app.use(limiter);

// Session
app.use(session({
  secret: process.env.SESSION_SECRET || 'change_this_in_production',
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false }
}));

app.use(passport.initialize());
app.use(passport.session());

// MongoDB connection
const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/mywebapp';
if (process.env.NODE_ENV !== 'test') {
  mongoose.connect(mongoUri)
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error('MongoDB connection error:', err.message));
} else {
  console.log('Skipping MongoDB connection during tests');
}

// Routes
const users = require('./routes/users');
const collections = require('./routes/collections');
const manga = require('./routes/manga');
const auth = require('./routes/auth');
const achievements = require('./routes/achievements');

app.use('/api/users', users);
app.use('/api/collections', collections);
app.use('/api/manga', manga);
app.use('/api/auth', auth);
app.use('/api/achievements', achievements);

// Google OAuth routes (legacy - kept for backward compatibility)
app.get('/auth/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

app.get('/auth/google/callback', 
  passport.authenticate('google', { failureRedirect: '/login.html' }),
  (req, res) => {
    // Successful authentication, redirect home.
    res.redirect('/');
  }
);

app.get('/logout', (req, res) => {
  req.logout((err) => {
    if (err) {
      console.error('Logout error:', err);
      return res.status(500).send('Logout failed');
    }
    res.redirect('/signup.html');
  });
});

// Admin routes (serve admin static site; protected by auth middleware)
app.use('/admin', authMiddleware, express.static(path.join(__dirname, 'public', 'admin')));

// Serve React build in production
const reactDistPath = path.join(__dirname, 'client', 'dist');
app.use(express.static(reactDistPath));

// Fallback: serve static assets from public for legacy pages
app.use(express.static(path.join(__dirname, 'public')));
app.use('/landing', express.static(path.join(__dirname, 'public/landing')));

// Simple health check
app.get('/health', (req, res) => res.json({ status: 'ok' }));

// Diagnostic endpoint for debugging connectivity
app.get('/diag', (req, res) => {
  res.json({
    status: 'ok',
    pid: process.pid,
    env: process.env.NODE_ENV || 'development',
    uptime: process.uptime(),
    now: new Date().toISOString()
  });
});

// SPA fallback middleware: serve React index.html for non-API requests
app.use((req, res, next) => {
  // Let API routes and static assets through
  if (req.path.startsWith('/api') || req.path.startsWith('/landing') || req.path.startsWith('/admin') || req.path.startsWith('/static')) {
    return next();
  }

  const indexPath = path.join(reactDistPath, 'index.html');
  res.sendFile(indexPath, (err) => {
    if (err) {
      // Fallback to legacy landing page if React build doesn't exist (dev mode)
      return res.sendFile(path.join(__dirname, 'public', 'landing', 'index.html'));
    }
  });
});

// Error handling middleware
app.use(errorHandler);

if (require.main === module) {
  // Bind explicitly to all interfaces to avoid localhost resolution issues on some environments
  app.listen(port, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${port} (also available at http://localhost:${port})`);
  });
}

// for 
module.exports = app;