const express = require('express');
const router = express.Router();
const { executeQuery } = require('../database/config');
const { authenticateToken, authorize } = require('../middleware/auth');

// Get all testimonials
router.get('/', async (req, res) => {
    try {
        const result = await executeQuery(`
            SELECT * FROM testimonials 
            ORDER BY created_at DESC
        `);

        res.json({
            success: true,
            data: result.success ? result.data : []
        });
    } catch (error) {
        console.error('Get testimonials error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to load testimonials'
        });
    }
});

// Get single testimonial
router.get('/:id', async (req, res) => {
    try {
        const result = await executeQuery(`
            SELECT * FROM testimonials WHERE id = ?
        `, [req.params.id]);

        if (!result.success || result.data.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Testimonial not found'
            });
        }

        res.json({
            success: true,
            data: result.data[0]
        });
    } catch (error) {
        console.error('Get testimonial error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to load testimonial'
        });
    }
});

// Create new testimonial
router.post('/', authenticateToken, authorize('admin', 'manager'), async (req, res) => {
    try {
        const { client_name, client_position, client_company, rating, testimonial, is_featured } = req.body;

        if (!client_name || !testimonial || !rating) {
            return res.status(400).json({
                success: false,
                message: 'Client name, testimonial, and rating are required'
            });
        }

        const result = await executeQuery(`
            INSERT INTO testimonials (client_name, client_position, client_company, rating, testimonial, is_featured)
            VALUES (?, ?, ?, ?, ?, ?)
        `, [client_name, client_position, client_company, rating, testimonial, is_featured || false]);

        if (result.success) {
            res.status(201).json({
                success: true,
                message: 'Testimonial created successfully',
                data: { id: result.data.insertId }
            });
        } else {
            res.status(500).json({
                success: false,
                message: 'Failed to create testimonial'
            });
        }
    } catch (error) {
        console.error('Create testimonial error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to create testimonial'
        });
    }
});

// Update testimonial
router.put('/:id', authenticateToken, authorize('admin', 'manager'), async (req, res) => {
    try {
        const { client_name, client_position, client_company, rating, testimonial, is_featured } = req.body;

        const result = await executeQuery(`
            UPDATE testimonials 
            SET client_name = ?, client_position = ?, client_company = ?, 
                rating = ?, testimonial = ?, is_featured = ?, updated_at = CURRENT_TIMESTAMP
            WHERE id = ?
        `, [client_name, client_position, client_company, rating, testimonial, is_featured, req.params.id]);

        if (result.success && result.data.affectedRows > 0) {
            res.json({
                success: true,
                message: 'Testimonial updated successfully'
            });
        } else {
            res.status(404).json({
                success: false,
                message: 'Testimonial not found'
            });
        }
    } catch (error) {
        console.error('Update testimonial error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update testimonial'
        });
    }
});

// Delete testimonial
router.delete('/:id', authenticateToken, authorize('admin'), async (req, res) => {
    try {
        const result = await executeQuery(`
            DELETE FROM testimonials WHERE id = ?
        `, [req.params.id]);

        if (result.success && result.data.affectedRows > 0) {
            res.json({
                success: true,
                message: 'Testimonial deleted successfully'
            });
        } else {
            res.status(404).json({
                success: false,
                message: 'Testimonial not found'
            });
        }
    } catch (error) {
        console.error('Delete testimonial error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to delete testimonial'
        });
    }
});

module.exports = router; 