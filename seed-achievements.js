const mongoose = require('mongoose');
const Achievement = require('./models/achievement');

require('dotenv').config();

const achievements = [
    {
        id: 'first-collection',
        title: 'First Collection',
        description: 'Create your first collection',
        criteria: 'Create at least one collection',
        points: 10,
        rarity: 'common'
    },
    {
        id: 'collection-master',
        title: 'Collection Master',
        description: 'Create 10 collections',
        criteria: 'Create 10 or more collections',
        points: 50,
        rarity: 'rare'
    },
    {
        id: 'explorer',
        title: 'Explorer',
        description: 'Browse 50 different manga',
        criteria: 'View 50 different manga entries',
        points: 25,
        rarity: 'common'
    },
    {
        id: 'social-butterfly',
        title: 'Social Butterfly',
        description: 'Follow 5 users',
        criteria: 'Follow 5 or more users',
        points: 30,
        rarity: 'rare'
    },
    {
        id: 'legendary-collector',
        title: 'Legendary Collector',
        description: 'Collect 100 items',
        criteria: 'Add 100 items to collections',
        points: 100,
        rarity: 'legendary'
    }
];

async function seedAchievements() {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/mywebapp');
        console.log('Connected to MongoDB');

        for (const achievementData of achievements) {
            const existing = await Achievement.findOne({ id: achievementData.id });
            if (!existing) {
                const achievement = new Achievement(achievementData);
                await achievement.save();
                console.log(`Created achievement: ${achievement.title}`);
            } else {
                console.log(`Achievement already exists: ${achievementData.title}`);
            }
        }

        console.log('Achievements seeding completed');
    } catch (error) {
        console.error('Error seeding achievements:', error);
    } finally {
        await mongoose.connection.close();
        console.log('Database connection closed');
    }
}

if (require.main === module) {
    seedAchievements();
}

module.exports = seedAchievements;