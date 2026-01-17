const express = require('express');
const router = express.Router();

// Static list of achievements
// In a full implementation, these might come from a database 'Achievement' collection
const ACHIEVEMENTS_DATA = [
    {
        id: 'welcome_1',
        title: 'Welcome to Inkbit',
        description: 'Create your account and sign in for the first time.',
        icon: '👋',
        xp: 10
    },
    {
        id: 'col_1',
        title: 'First Collection',
        description: 'Create your very first collection.',
        icon: '🌱',
        xp: 50
    },
    {
        id: 'col_5',
        title: 'Growing Library',
        description: 'Add 5 items to your collections.',
        icon: '📚',
        xp: 100
    },
    {
        id: 'profile_1',
        title: 'Who am I?',
        description: 'Update your profile bio and location.',
        icon: '🎭',
        xp: 20
    },
    {
        id: 'explore_1',
        title: 'Explorer',
        description: 'Visit the Explore page.',
        icon: '🧭',
        xp: 10
    }
];

router.get('/', (req, res) => {
    const user = req.user;
    const response = ACHIEVEMENTS_DATA.map(ach => ({
        ...ach,
        unlocked: user ? (ach.id === 'welcome_1') : false // Mock logic: Unlock 'Welcome' if logged in
    }));
    res.json(response);
});

module.exports = router;