const express = require('express');
const router = express.Router();
const Achievement = require('../models/achievement');
const User = require('../models/user');
const authMiddleware = require('../middleware/auth');

// Get all achievements
router.get('/', async (req, res) => {
    try {
        const achievements = await Achievement.find().sort({ createdAt: -1 });
        res.json(achievements);
    } catch (error) {
        console.error('Error fetching achievements:', error);
        res.status(500).json({ error: 'Failed to fetch achievements' });
    }
});

// Get user's unlocked achievements
router.get('/unlocked', authMiddleware, async (req, res) => {
    try {
        const user = await User.findById(req.user._id).populate('unlockedAchievements.achievement');
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.json(user.unlockedAchievements);
    } catch (error) {
        console.error('Error fetching unlocked achievements:', error);
        res.status(500).json({ error: 'Failed to fetch unlocked achievements' });
    }
});

// Unlock an achievement for the user
router.post('/:id/unlock', authMiddleware, async (req, res) => {
    try {
        const achievementId = req.params.id;
        const user = await User.findById(req.user._id);

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Check if achievement exists
        const achievement = await Achievement.findOne({ id: achievementId });
        if (!achievement) {
            return res.status(404).json({ error: 'Achievement not found' });
        }

        // Check if already unlocked
        const alreadyUnlocked = user.unlockedAchievements.some(
            ua => ua.achievement.toString() === achievement._id.toString()
        );

        if (alreadyUnlocked) {
            return res.status(400).json({ error: 'Achievement already unlocked' });
        }

        // Unlock the achievement
        user.unlockedAchievements.push({
            achievement: achievement._id,
            unlockedAt: new Date()
        });

        await user.save();

        res.json({
            message: 'Achievement unlocked successfully',
            achievement: achievement
        });
    } catch (error) {
        console.error('Error unlocking achievement:', error);
        res.status(500).json({ error: 'Failed to unlock achievement' });
    }
});

// Admin: Create a new achievement
router.post('/', authMiddleware, async (req, res) => {
    try {
        // TODO: Add admin check
        const { id, title, description, icon, criteria, points, rarity } = req.body;

        const achievement = new Achievement({
            id,
            title,
            description,
            icon,
            criteria,
            points,
            rarity
        });

        await achievement.save();
        res.status(201).json(achievement);
    } catch (error) {
        console.error('Error creating achievement:', error);
        if (error.code === 11000) {
            res.status(400).json({ error: 'Achievement ID already exists' });
        } else {
            res.status(500).json({ error: 'Failed to create achievement' });
        }
    }
});

module.exports = router;