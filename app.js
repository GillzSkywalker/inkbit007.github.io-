const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const passport = require('passport');
const session = require('express-session');
const errorHandler = require('./middleware/errorHandler');
const auth = require('./middleware/auth');
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
mongoose.connect(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error('MongoDB connection error:', err.message));

// Routes
const users = require('./routes/users');
const collections = require('./routes/collections');
app.use('/api/users', users);
app.use('/api/collections', collections);

// Google OAuth routes
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
  req.logout(() => {});
  res.redirect('/');
});

// Admin routes (serve admin static site; protected by auth middleware)
app.use('/admin', auth, express.static(path.join(__dirname, 'public', 'admin')));

// Landing page and public assets
app.use(express.static(path.join(__dirname, 'public')));
app.use('/landing', express.static(path.join(__dirname, 'public/landing')));

// Serve landing index at root
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'landing', 'index.html'));
});

// Simple health check
app.get('/health', (req, res) => res.json({ status: 'ok' }));

// Error handling middleware
app.use(errorHandler);

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});