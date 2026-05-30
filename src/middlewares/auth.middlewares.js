import jwt from 'jsonwebtoken';
import { User } from '../models/index.js';
import { STATUS_CODES } from '../config/constants.config.js';
import ERRORS from '../locales/errors/en.js';

// 1. Verify if the user is logged in
export const protect = async (req, res, next) => {
    let token;

    // Check if the token is in the headers
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1]; // Extract the token part
    }

    if (!token) {
        return res.status(STATUS_CODES.UNAUTHORIZED).json({
            success: false,
            message: "Not authorized to access this route. Please log in."
        });
    }

    try {
        // Verify the token using your secret key
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Find the user in the database and attach them to the request object
        req.user = await User.findById(decoded.id);

        if (!req.user) {
            return res.status(STATUS_CODES.UNAUTHORIZED).json({
                success: false,
                message: "User belonging to this token no longer exists."
            });
        }

        next(); // Token is valid, proceed to the controller!
    } catch (error) {
        console.error("JWT VERIFY ERROR:", error.message);
        return res.status(STATUS_CODES.UNAUTHORIZED).json({
            success: false,
            message: "Not authorized. Token failed or expired."
        });
    }
};

// 2. Check if the user has the right role
export const authorize = (...roles) => {
    return (req, res, next) => {
        // req.user was set in the `protect` middleware above
        if (!roles.includes(req.user.role)) {
            return res.status(STATUS_CODES.FORBIDDEN).json({
                success: false,
                message: `User role '${req.user.role}' is not authorized to perform this action.`
            });
        }
        next();
    };
};

export const authorizeRoles = (...roles) => {
    return (req, res, next) => {
        // req.user is set by your protect middleware right before this runs
        if (!req.user.role || !roles.includes(req.user.role)) {
            return res.status(403).json({
                success: false,
                message: `User role '${req.user.role || 'undefined'}' is not authorized to access this route.`
            });
        }
        next(); 
    };
};