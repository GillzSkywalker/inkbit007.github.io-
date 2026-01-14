const mongoose = require('mongoose');

const AchievementSchema = new mongoose.Schema({
    id: {
        type: String,
        required: true,
        unique: true
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    icon: {
        type: String,
        default: null
    },
    criteria: {
        type: String,
        required: true
    },
    points: {
        type: Number,
        default: 0
    },
    rarity: {
        type: String,
        enum: ['common', 'rare', 'epic', 'legendary'],
        default: 'common'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Achievement', AchievementSchema);