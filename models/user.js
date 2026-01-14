const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    googleId: {
        type: String,
        unique: true,
        sparse: true
    },  
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String
    },
    picture: {
        type: String,
        default: null
    },
    authMethod: {
        type: String,
        enum: ['password', 'google'],
        default: 'password'
    },
    unlockedAchievements: [{
        achievement: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Achievement'
        },
        unlockedAt: {
            type: Date,
            default: Date.now
        }
    }],
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('User', UserSchema);