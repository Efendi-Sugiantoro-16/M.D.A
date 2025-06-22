const express = require('express');
const router = express.Router();
const { executeQuery } = require('../database/config');
const { authenticateToken, authorizeRoles } = require('../middleware/auth');

// Get all settings
router.get('/', async (req, res) => {
    try {
        const result = await executeQuery(`
            SELECT setting_key, setting_value, setting_type, description 
            FROM settings 
            ORDER BY setting_key
        `);

        res.json({
            success: true,
            data: result.success ? result.data : []
        });
    } catch (error) {
        console.error('Get settings error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to load settings'
        });
    }
});

// Get single setting
router.get('/:key', async (req, res) => {
    try {
        const result = await executeQuery(`
            SELECT setting_key, setting_value, setting_type, description 
            FROM settings 
            WHERE setting_key = ?
        `, [req.params.key]);

        if (!result.success || result.data.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Setting not found'
            });
        }

        res.json({
            success: true,
            data: result.data[0]
        });
    } catch (error) {
        console.error('Get setting error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to load setting'
        });
    }
});

// Update settings (bulk)
router.put('/', authenticateToken, authorizeRoles(['admin']), async (req, res) => {
    try {
        const settings = req.body;
        const updates = [];
        const errors = [];

        for (const [key, value] of Object.entries(settings)) {
            try {
                const result = await executeQuery(`
                    UPDATE settings 
                    SET setting_value = ?, updated_at = CURRENT_TIMESTAMP
                    WHERE setting_key = ?
                `, [value, key]);

                if (result.success && result.data.affectedRows > 0) {
                    updates.push(key);
                } else {
                    errors.push(`${key}: Setting not found`);
                }
            } catch (error) {
                errors.push(`${key}: ${error.message}`);
            }
        }

        if (errors.length === 0) {
            res.json({
                success: true,
                message: `Successfully updated ${updates.length} settings`,
                data: { updated: updates }
            });
        } else {
            res.status(400).json({
                success: false,
                message: 'Some settings failed to update',
                data: { updated: updates, errors }
            });
        }
    } catch (error) {
        console.error('Update settings error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update settings'
        });
    }
});

// Update single setting
router.put('/:key', authenticateToken, authorizeRoles(['admin']), async (req, res) => {
    try {
        const { value } = req.body;

        const result = await executeQuery(`
            UPDATE settings 
            SET setting_value = ?, updated_at = CURRENT_TIMESTAMP
            WHERE setting_key = ?
        `, [value, req.params.key]);

        if (result.success && result.data.affectedRows > 0) {
            res.json({
                success: true,
                message: 'Setting updated successfully'
            });
        } else {
            res.status(404).json({
                success: false,
                message: 'Setting not found'
            });
        }
    } catch (error) {
        console.error('Update setting error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update setting'
        });
    }
});

// Create new setting
router.post('/', authenticateToken, authorizeRoles(['admin']), async (req, res) => {
    try {
        const { setting_key, setting_value, setting_type, description } = req.body;

        if (!setting_key || setting_value === undefined) {
            return res.status(400).json({
                success: false,
                message: 'Setting key and value are required'
            });
        }

        const result = await executeQuery(`
            INSERT INTO settings (setting_key, setting_value, setting_type, description)
            VALUES (?, ?, ?, ?)
        `, [setting_key, setting_value, setting_type || 'string', description]);

        if (result.success) {
            res.status(201).json({
                success: true,
                message: 'Setting created successfully',
                data: { id: result.data.insertId }
            });
        } else {
            res.status(500).json({
                success: false,
                message: 'Failed to create setting'
            });
        }
    } catch (error) {
        console.error('Create setting error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to create setting'
        });
    }
});

// Delete setting
router.delete('/:key', authenticateToken, authorizeRoles(['admin']), async (req, res) => {
    try {
        const result = await executeQuery(`
            DELETE FROM settings WHERE setting_key = ?
        `, [req.params.key]);

        if (result.success && result.data.affectedRows > 0) {
            res.json({
                success: true,
                message: 'Setting deleted successfully'
            });
        } else {
            res.status(404).json({
                success: false,
                message: 'Setting not found'
            });
        }
    } catch (error) {
        console.error('Delete setting error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to delete setting'
        });
    }
});

module.exports = router; 