const jwt = require('jsonwebtoken');
const { executeQuery } = require('../database/config');

// Protect routes - require authentication
const protect = async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            // Get token from header
            token = req.headers.authorization.split(' ')[1];

            // Verify token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // Get user from database
            const result = await executeQuery(
                'SELECT id, username, email, first_name, last_name, role, is_active FROM users WHERE id = ?',
                [decoded.id]
            );

            if (!result.success || result.data.length === 0) {
                return res.status(401).json({
                    success: false,
                    error: 'User not found'
                });
            }

            const user = result.data[0];

            if (!user.is_active) {
                return res.status(401).json({
                    success: false,
                    error: 'User account is deactivated'
                });
            }

            req.user = user;
            next();
        } catch (error) {
            console.error('Token verification error:', error);
            return res.status(401).json({
                success: false,
                error: 'Not authorized to access this route'
            });
        }
    }

    if (!token) {
        return res.status(401).json({
            success: false,
            error: 'Not authorized to access this route'
        });
    }
};

// Grant access to specific roles
const authorize = (...roles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({
                success: false,
                error: 'Not authorized to access this route'
            });
        }

        if (!roles.includes(req.user.role)) {
            return res.status(403).json({
                success: false,
                error: `User role '${req.user.role}' is not authorized to access this route`
            });
        }

        next();
    };
};

// Optional authentication - doesn't fail if no token
const optionalAuth = async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            const result = await executeQuery(
                'SELECT id, username, email, first_name, last_name, role, is_active FROM users WHERE id = ?',
                [decoded.id]
            );

            if (result.success && result.data.length > 0) {
                const user = result.data[0];
                if (user.is_active) {
                    req.user = user;
                }
            }
        } catch (error) {
            // Token is invalid, but we don't fail the request
            console.log('Optional auth - invalid token:', error.message);
        }
    }

    next();
};

module.exports = {
    protect,
    authenticateToken: protect, // Alias for protect
    authorize,
    authorizeRoles: authorize, // Alias for authorize
    optionalAuth
}; 