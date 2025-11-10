const express = require('express');
const router = express.Router();
const Collection = require('../models/collection');
const auth = require('../middleware/auth');

// Get all public collections
router.get('/public', async (req, res) => {
    try {
        const collections = await Collection.find({ isPublic: true })
            .populate('owner', 'username email')
            .sort('-createdAt');
        res.json(collections);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get user's collections
router.get('/my-collections', auth, async (req, res) => {
    try {
        const collections = await Collection.find({ owner: req.user._id })
            .sort('-createdAt');
        res.json(collections);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get a single collection
router.get('/:id', async (req, res) => {
    try {
        const collection = await Collection.findById(req.params.id)
            .populate('owner', 'username email');
        
        if (!collection) {
            return res.status(404).json({ error: 'Collection not found' });
        }

        if (!collection.isPublic && (!req.user || collection.owner.toString() !== req.user._id.toString())) {
            return res.status(403).json({ error: 'Access denied' });
        }

        res.json(collection);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Create a new collection
router.post('/', auth, async (req, res) => {
    try {
        const collection = new Collection({
            ...req.body,
            owner: req.user._id
        });
        await collection.save();
        res.status(201).json(collection);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Update a collection
router.put('/:id', auth, async (req, res) => {
    try {
        const collection = await Collection.findOne({ 
            _id: req.params.id,
            owner: req.user._id
        });

        if (!collection) {
            return res.status(404).json({ error: 'Collection not found or access denied' });
        }

        Object.assign(collection, req.body);
        await collection.save();
        res.json(collection);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Delete a collection
router.delete('/:id', auth, async (req, res) => {
    try {
        const collection = await Collection.findOneAndDelete({
            _id: req.params.id,
            owner: req.user._id
        });

        if (!collection) {
            return res.status(404).json({ error: 'Collection not found or access denied' });
        }

        res.json({ message: 'Collection deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Add item to collection
router.post('/:id/items', auth, async (req, res) => {
    try {
        const collection = await Collection.findOne({
            _id: req.params.id,
            owner: req.user._id
        });

        if (!collection) {
            return res.status(404).json({ error: 'Collection not found or access denied' });
        }

        collection.items.push(req.body);
        await collection.save();
        res.status(201).json(collection);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Remove item from collection
router.delete('/:id/items/:itemId', auth, async (req, res) => {
    try {
        const collection = await Collection.findOne({
            _id: req.params.id,
            owner: req.user._id
        });

        if (!collection) {
            return res.status(404).json({ error: 'Collection not found or access denied' });
        }

        collection.items = collection.items.filter(item => item._id.toString() !== req.params.itemId);
        await collection.save();
        res.json(collection);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;