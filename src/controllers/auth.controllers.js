import * as authService from '../services/auth.services.js';
import { STATUS_CODES } from '../config/constants.config.js';
import ERRORS from '../locales/errors/en.js';
import SUCCESS from '../locales/success/en.js'; 
import { User } from '../models/index.js';
import { sendEmail } from '../utils/sendEmail.js';
import bcrypt from 'bcryptjs';
import { ROLES } from '../config/constants.config.js';

export const register = async (req, res, next) => {
    try {
        const { role, companyName } = req.body;

        // 1. 🚨 THE RECRUITER CHECK 🚨
        // Intercept bad requests before they hit the Service layer or Database
        if (role === ROLES.RECRUITER && !companyName) {
            return res.status(STATUS_CODES.BAD_REQUEST).json({ 
                success: false, 
                message: "Recruiters must provide a company name" // Or add this to your ERRORS constants!
            });
        }
        if (role === ROLES.SEEKER && (!skills || !Array.isArray(skills) || skills.length === 0)) {
            return res.status(STATUS_CODES.BAD_REQUEST).json({ 
                success: false, 
                message: "Seekers must provide at least one skill" 
            });
        }

        // 2. Proceed with your clean Service Layer architecture
        const user = await authService.registerUser(req.body);
        
        // 3. Update the clean response to include companyName
        const cleanUserResponse = {
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            companyName: user.companyName, // 👈 Added this for the Navbar
            skills: user.skills,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt
        };
        
        res.locals.response = {
            statusCode: STATUS_CODES.CREATED,
            message: SUCCESS.USER_REGISTERED, 
            data: cleanUserResponse
        };
        
        next();
        
    } catch (error) {
        res.status(STATUS_CODES.BAD_REQUEST).json({ 
            success: false, 
            message: error.message || ERRORS.SERVER_ERROR 
        });
    }
};

export const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        
        // 1. Destructure the user and token from your service
        const { user, token } = await authService.loginUser(email, password);

        const cleanUserResponse = {
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            skills: user.skills,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt
        };

        // 2. 👉 Set the token in the Response Header
        // Standard practice is to prefix the token with "Bearer "
        res.setHeader('Authorization', `Bearer ${token}`);

        // 3. 👉 Only pass the user data to the body (leaving the token out)
        res.locals.response = {
            statusCode: STATUS_CODES.OK,
            message: SUCCESS.LOGIN_SUCCESS,
            data: { user: cleanUserResponse } // No token here!
        };
        
        next();
    } catch (error) {
        res.status(STATUS_CODES.BAD_REQUEST).json({ 
            success: false, 
            message: error.message || ERRORS.SERVER_ERROR 
        });
    }
};

export const getCode = async (req, res, next) => {
    try {
        const { email } = req.body;
        await authService.processForgotPassword(email);

        res.locals.response = {
            statusCode: STATUS_CODES.OK,
            message: "OTP sent to your email successfully"
        };
        next();
    } catch (error) {
        res.status(STATUS_CODES.BAD_REQUEST).json({ success: false, message: error.message });
    }
};

export const verifyCode = async (req, res, next) => {
    try {
        const { email, otp } = req.body;
        await authService.verifyPasswordResetOtp(email, otp);

        res.locals.response = {
            statusCode: STATUS_CODES.OK,
            message: "OTP verified successfully. You can now reset your password."
        };
        next();
    } catch (error) {
        res.status(STATUS_CODES.BAD_REQUEST).json({ success: false, message: error.message });
    }
};

export const resetPassword = async (req, res, next) => {
    try {
        const { email, newPassword } = req.body;
        await authService.resetUserPassword(email, newPassword);

        res.locals.response = {
            statusCode: STATUS_CODES.OK,
            message: "Password reset successfully. You can now log in."
        };
        next();
    } catch (error) {
        res.status(STATUS_CODES.BAD_REQUEST).json({ success: false, message: error.message });
    }
};

// src/controllers/authController.js

export const getMe = async (req, res) => {
    try {
        // req.user._id is provided by your `protect` middleware!
        // We use .select('-password') to ensure we NEVER send the password back to the React frontend.
        const user = await User.findById(req.user._id).select('name role companyName -_id');

        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        res.status(200).json({
            success: true,
            data: user
        });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server Error" });
    }
};