
const API_URL = 'http://localhost:5000/api/auth';

export const registerUser = async (userData) => {
    try {
        const response = await fetch(`${API_URL}/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(userData)
        });
        return await response.json(); 
    } catch (error) {
        return { success: false, message: "Server connection failed." };
    }
};

export const loginUser = async (email, password) => {
    try {
        const response = await fetch(`${API_URL}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });
        return await response.json(); 
    } catch (error) {
        return { success: false, message: "Server connection failed." };
    }
};

// ==========================================
// FORGOT PASSWORD FLOW
// ==========================================

export const requestResetCode = async (email) => {
    try {
        const response = await fetch(`${API_URL}/forgot-password/getcode`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email })
        });
        return await response.json();
    } catch (error) {
        return { success: false, message: "Server connection failed." };
    }
};

export const verifyResetCode = async (email, otp) => {
    try {
        const response = await fetch(`${API_URL}/forgot-password/verifycode`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, otp })
        });
        return await response.json();
    } catch (error) {
        return { success: false, message: "Server connection failed." };
    }
};

export const resetPassword = async (email, otp, newPassword) => {
    try {
        const response = await fetch(`${API_URL}/forgot-password/resetcode`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, otp, newPassword })
        });
        return await response.json();
    } catch (error) {
        return { success: false, message: "Server connection failed." };
    }
};