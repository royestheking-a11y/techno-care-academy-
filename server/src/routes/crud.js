const express = require('express');
const { deleteFromCloudinary } = require('../utils/cloudinary');

/**
 * Create a CRUD router for a Mongoose model
 * @param {Model} Model - Mongoose model
 * @param {object} options - Optional configuration
 * @param {string[]} options.imageFields - Fields containing Cloudinary image URLs
 */
const createCrudRouter = (Model, options = {}) => {
    const router = express.Router();
    const imageFields = options.imageFields || [];

    // Get all
    router.get('/', async (req, res) => {
        try {
            const filters = req.query || {};
            const items = await Model.find(filters);
            res.json(items);
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    });

    // Get one by ID (custom string/number ID)
    router.get('/:id', async (req, res) => {
        try {
            const item = await Model.findOne({ id: req.params.id });
            if (!item) return res.status(404).json({ message: 'Item not found' });
            res.json(item);
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    });

    // Create
    router.post('/', async (req, res) => {
        try {
            // Auto-assign ID if missing and type is number/string based on schema (simplified)
            // Ideally the frontend sends an ID or we let Mongo use _id. 
            // But for compatibility with existing string IDs, we blindly accept body for now.
            // If we need timestamp-based ID:
            if (!req.body.id) {
                // This is a naive ID generation strategy for compatibility
                req.body.id = Date.now().toString();
            }

            const newItem = new Model(req.body);
            const savedItem = await newItem.save();
            res.status(201).json(savedItem);
        } catch (err) {
            res.status(400).json({ message: err.message });
        }
    });

    // Update
    router.put('/:id', async (req, res) => {
        try {
            // If updating an image field, delete old image from Cloudinary
            if (imageFields.length > 0) {
                const existingItem = await Model.findOne({ id: req.params.id });
                if (existingItem) {
                    for (const field of imageFields) {
                        const oldValue = existingItem[field];
                        const newValue = req.body[field];
                        // If image field is being updated with a new value
                        if (oldValue && newValue && oldValue !== newValue) {
                            console.log(`🔄 Image updated in ${field}, deleting old image...`);
                            await deleteFromCloudinary(oldValue);
                        }
                    }
                }
            }

            const updatedItem = await Model.findOneAndUpdate(
                { id: req.params.id },
                req.body,
                { new: true }
            );
            if (!updatedItem) return res.status(404).json({ message: 'Item not found' });
            res.json(updatedItem);
        } catch (err) {
            res.status(400).json({ message: err.message });
        }
    });

    // Delete - with Cloudinary cleanup
    router.delete('/:id', async (req, res) => {
        try {
            // First, find the item to get image URLs
            const itemToDelete = await Model.findOne({ id: req.params.id });
            if (!itemToDelete) {
                return res.status(404).json({ message: 'Item not found' });
            }

            // Delete images from Cloudinary
            if (imageFields.length > 0) {
                console.log(`🗑️ Deleting images for ${Model.modelName} ID: ${req.params.id}`);
                for (const field of imageFields) {
                    const imageUrl = itemToDelete[field];
                    if (imageUrl) {
                        await deleteFromCloudinary(imageUrl);
                    }
                }
            }

            // Then delete from MongoDB
            await Model.findOneAndDelete({ id: req.params.id });
            res.json({ message: 'Item deleted' });
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    });

    return router;
};

module.exports = createCrudRouter;

