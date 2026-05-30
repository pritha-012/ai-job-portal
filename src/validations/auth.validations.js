import ERRORS from '../locales/errors/en.js';
import { STATUS_CODES } from '../config/constants.config.js';

// Standard Regex for basic email validation
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const validateRegister = (req, res, next) => {
    const { name, email, password } = req.body;

    // 1. Check for missing fields
    if (!name || !email || !password) {
        return res.status(STATUS_CODES.BAD_REQUEST).json({
            success: false,
            message: ERRORS.VALIDATION_FAILED
        });
    }

    // 2. Validate Email Format
    if (!emailRegex.test(email)) {
        return res.status(STATUS_CODES.BAD_REQUEST).json({
            success: false,
            message: ERRORS.INVALID_EMAIL_FORMAT
        });
    }

    // 3. Validate Password Length
    if (password.length < 8) {
        return res.status(STATUS_CODES.BAD_REQUEST).json({
            success: false,
            message: ERRORS.PASSWORD_TOO_SHORT
        });
    }

    next(); // Data is perfect, proceed to controller
};

export const validateLogin = (req, res, next) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(STATUS_CODES.BAD_REQUEST).json({
            success: false,
            message: ERRORS.VALIDATION_FAILED
        });
    }

    // It is good practice to check email format on login too, 
    // to prevent hitting the database with an obviously invalid string
    if (!emailRegex.test(email)) {
        return res.status(STATUS_CODES.BAD_REQUEST).json({
            success: false,
            message: ERRORS.INVALID_EMAIL_FORMAT
        });
    }
    console.log("📍 2. Validation Passed, calling next()");

    next(); // Data is perfect, proceed to controller
};