import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import * as userRepository from '../repositories/user.repositories.js';
import { sendEmail } from '../utils/sendEmail.js';
import ERRORS from '../locales/errors/en.js';

export const registerUser = async (userData) => {
    // 1. Check if user already exists
    const existingUser = await userRepository.findUserByEmail(userData.email);
    if (existingUser) {
        throw new Error(ERRORS.EMAIL_ALREADY_EXISTS);
    }

    // 2. Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(userData.password, salt);

    // 3. Create the user
    const newUser = await userRepository.createUser({
        ...userData,
        password: hashedPassword
    });

    // 4. Return user without password
    const userToReturn = newUser.toObject();
    delete userToReturn.password;
    return userToReturn;
};

export const loginUser = async (email, password) => {
    // 1. Find user
    const user = await userRepository.findUserByEmail(email);
    if (!user) throw new Error(ERRORS.USER_NOT_FOUND);

    // 2. Verify password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw new Error(ERRORS.INVALID_CREDENTIALS);

    // 3. Generate JWT
    // Ensure you add JWT_SECRET=your_super_secret_key_here to your .env file!
    const token = jwt.sign(
        { id: user._id, role: user.role },
        process.env.JWT_SECRET || 'fallback_secret',
        { expiresIn: '1d' }
    );

    const userToReturn = user.toObject();
    delete userToReturn.password;

    return { user: userToReturn, token };
};


// ... your existing registerUser and loginUser functions ...

export const processForgotPassword = async (email) => {
    const user = await userRepository.findUserByEmail(email);
    if (!user) throw new Error("User not found");

    // Generate a 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    
    // Hash OTP and set expiration (10 mins)
    user.resetPasswordOtp = await bcrypt.hash(otp, 10);
    user.resetPasswordExpires = Date.now() + 10 * 60 * 1000; 
    await userRepository.saveUser(user);

    // Send email
    const message = `Your password reset code is: ${otp}. It is valid for 10 minutes.`;
    await sendEmail({ email: user.email, subject: "Password Reset Code", message });
    
    return true;
};

export const verifyPasswordResetOtp = async (email, otp) => {
    // Note: We need to find the user manually here to check the expiration date easily
    const user = await userRepository.findUserByEmail(email);
    
    if (!user || !user.resetPasswordOtp) {
        throw new Error("No OTP requested for this user");
    }

    if (user.resetPasswordExpires < Date.now()) {
        throw new Error("OTP has expired");
    }

    const isMatch = await bcrypt.compare(otp.toString(), user.resetPasswordOtp);
    if (!isMatch) throw new Error("Incorrect OTP");

    return true;
};

export const resetUserPassword = async (email, newPassword) => {
    const user = await userRepository.findUserByEmail(email);
    if (!user) throw new Error("User not found");

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    
    // Clear the OTP fields
    user.resetPasswordOtp = null;
    user.resetPasswordExpires = null;
    
    await userRepository.saveUser(user);
    return true;
};