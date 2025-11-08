const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const User = require('../models/user');

// Create a new user (hash password)
router.post('/', async (req, res) => {
    const { name, email, password } = req.body;
    if (!name || !email || !password) return res.status(400).json({ error: 'name, email and password are required' });
    try {
        const existing = await User.findOne({ email });
        if (existing) return res.status(409).json({ error: 'Email already in use' });

        const saltRounds = 10;
        const hashed = await bcrypt.hash(password, saltRounds);

        const newUser = new User({ name, email, password: hashed });
        await newUser.save();

        const userObj = newUser.toObject();
        delete userObj.password;
        res.status(201).json(userObj);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Get all users
router.get('/', async (req, res) => {
    try {
        const users = await User.find();
        // don't expose passwords
        const safe = users.map(u => {
            const obj = u.toObject();
            delete obj.password;
            return obj;
        });
        res.json(safe);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get a user by ID
router.get('/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ error: 'User not found' });
        const obj = user.toObject();
        delete obj.password;
        res.json(obj);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Update a user (if password provided, re-hash)
router.put('/:id', async (req, res) => {
    try {
        const updateData = { ...req.body };
        if (updateData.password) {
            const saltRounds = 10;
            updateData.password = await bcrypt.hash(updateData.password, saltRounds);
        }
        const user = await User.findByIdAndUpdate(req.params.id, updateData, { new: true });
        if (!user) return res.status(404).json({ error: 'User not found' });
        const obj = user.toObject();
        delete obj.password;
        res.json(obj);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Delete a user
router.delete('/:id', async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        if (!user) return res.status(404).json({ error: 'User not found' });
        res.json({ message: 'User deleted' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;