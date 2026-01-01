const express = require('express');
const router = express.Router();
const Collection = require('../models/collection');
const auth = require('../middleware/auth');

// Get all public collections
// GET /public?page=1&limit=10&search=term&tag=tagName
router.get('/public', async (req, res) => {
    try {
        const page = Math.max(parseInt(req.query.page) || 1, 1);
        const limit = Math.min(parseInt(req.query.limit) || 20, 100);
        const skip = (page - 1) * limit;

        const filter = { isPublic: true, status: 'approved' };

        if (req.query.tag) {
            filter.tags = req.query.tag;
        }

        if (req.query.search) {
            const term = req.query.search.trim();
            filter.$or = [
                { name: new RegExp(term, 'i') },
                { description: new RegExp(term, 'i') },
                { tags: new RegExp(term, 'i') }
            ];
        }

        const total = await Collection.countDocuments(filter);
        const collections = await Collection.find(filter)
            .populate('owner', 'name email')
            .sort('-createdAt')
            .skip(skip)
            .limit(limit);

        res.json({ page, limit, total, items: collections });
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
            .populate('owner', 'name email');
        if (!collection) return res.status(404).json({ error: 'Collection not found' });

        if (!collection.isPublic && (!req.user || collection.owner._id.toString() !== req.user._id.toString())) {
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
        const payload = { ...req.body, owner: req.user._id };
        // Basic server-side sanitization/validation
        if (!payload.name) return res.status(400).json({ error: 'Name is required' });
        const collection = new Collection(payload);
        await collection.save();
        res.status(201).json(collection);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Update a collection
router.put('/:id', auth, async (req, res) => {
    try {
        const collection = await Collection.findOne({ _id: req.params.id, owner: req.user._id });
        if (!collection) return res.status(404).json({ error: 'Collection not found or access denied' });

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
        const collection = await Collection.findOneAndDelete({ _id: req.params.id, owner: req.user._id });
        if (!collection) return res.status(404).json({ error: 'Collection not found or access denied' });
        res.json({ message: 'Collection deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Sync/save user's local collection items (e.g., from localStorage after login)
// POST /sync-collections
// Body: { name: 'My Collection', items: [{ title, author, imgSrc }, ...] }
router.post('/sync-collections', auth, async (req, res) => {
    try {
        const { name, items } = req.body;
        if (!name || !Array.isArray(items)) return res.status(400).json({ error: 'Name and items array required' });

        // Check if user already has a collection with this name
        let collection = await Collection.findOne({ owner: req.user._id, name });
        if (!collection) {
            collection = new Collection({ name, owner: req.user._id, items: [] });
        }

        // Merge items (avoid duplicates by title)
        const existingTitles = new Set(collection.items.map(i => i.title));
        const newItems = items.filter(i => !existingTitles.has(i.title));
        collection.items.push(...newItems);

        await collection.save();
        res.status(201).json({ message: 'Collection synced', collection });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Remove item from collection
router.delete('/:id/items/:itemId', auth, async (req, res) => {
    try {
        const collection = await Collection.findOne({ _id: req.params.id, owner: req.user._id });
        if (!collection) return res.status(404).json({ error: 'Collection not found or access denied' });

        collection.items = collection.items.filter(item => item._id.toString() !== req.params.itemId);
        await collection.save();
        res.json(collection);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;

// ----- Moderation endpoints -----
// Report a collection: POST /api/collections/:id/report
router.post('/:id/report', async (req, res) => {
    try {
        const { reason, reporter } = req.body || {};
        if (!reason) return res.status(400).json({ error: 'Reason is required' });

        const collection = await Collection.findById(req.params.id);
        if (!collection) return res.status(404).json({ error: 'Collection not found' });

        collection.reports = collection.reports || [];
        collection.reports.push({ reason: reason.toString(), reporter: reporter ? reporter.toString() : undefined });
        // mark pending for review
        collection.status = 'pending';
        await collection.save();

        res.json({ message: 'Report submitted' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Admin: list reported collections
router.get('/admin/reports', auth, async (req, res) => {
    try {
        // only collections with reports or pending status
        const reported = await Collection.find({ $or: [{ 'reports.0': { $exists: true } }, { status: 'pending' }] })
            .select('name owner reports status createdAt')
            .populate('owner', 'name email')
            .sort('-createdAt');
        res.json(reported);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Admin: moderate (approve/reject) a collection
router.put('/:id/moderate', auth, async (req, res) => {
    try {
        const { action, note } = req.body || {};
        if (!['approve', 'reject'].includes(action)) return res.status(400).json({ error: 'Action must be approve or reject' });

        const collection = await Collection.findById(req.params.id);
        if (!collection) return res.status(404).json({ error: 'Collection not found' });

        collection.status = action === 'approve' ? 'approved' : 'rejected';
        // optionally store moderation note as a report-like entry
        if (note) {
            collection.reports = collection.reports || [];
            collection.reports.push({ reason: `moderation:${action}`, reporter: `moderator:${req.ip}`, createdAt: new Date() });
        }
        await collection.save();
        res.json({ message: `Collection ${collection.status}` });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});
