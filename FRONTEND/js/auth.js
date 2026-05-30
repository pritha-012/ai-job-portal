// js/auth.js
import { registerUser, loginUser, requestResetCode, verifyResetCode, resetPassword } from './api.js'; 

document.addEventListener('DOMContentLoaded', () => {
    
    // Grab all forms
    const registerForm = document.getElementById('registerForm');
    const loginForm = document.getElementById('loginForm');
    const step1Form = document.getElementById('step1Form');
    const step2Form = document.getElementById('step2Form');
    const step3Form = document.getElementById('step3Form');

    // ==========================================
    // LOGIN LOGIC
    // ==========================================
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault(); // Stop page refresh

            const email = document.getElementById('loginEmail').value;
            const password = document.getElementById('loginPassword').value;

            // Send to your api.js service layer
            const response = await loginUser(email, password);

            if (response.success || response.statusCode === 200) {
                alert("Login Successful! Check your browser console to see the token.");
                
                // Save the VIP pass (JWT) to the browser's Local Storage
                if (response.token) {
                    localStorage.setItem('jobPortalToken', response.token);
                    console.log("JWT Token Saved:", response.token);
                }

                // Redirect to dashboard (we will build this later)
                // window.location.href = 'dashboard.html'; 
            } else {
                alert("Login failed: " + (response.message || "Invalid credentials"));
            }
        });
    }

    // ==========================================
    // REGISTRATION LOGIC
    // ==========================================
    if (registerForm) {
        registerForm.addEventListener('submit', async (e) => {
            e.preventDefault(); 

            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            const confirmPassword = document.getElementById('confirmPassword').value;
            const role = document.getElementById('role').value;
            const skillsRaw = document.getElementById('skills').value;

            if (password !== confirmPassword) {
                alert("Error: Passwords do not match!");
                return;
            }

            const skillsArray = skillsRaw.split(',').map(s => s.trim()).filter(s => s !== "");

            const userData = { name, email, password, role, skills: skillsArray };

            const response = await registerUser(userData);

            if (response.success || response.statusCode === 201) {
                alert("Success! Redirecting to login...");
                window.location.href = "index.html"; 
            } else {
                alert("Registration failed: " + (response.message || "Unknown error"));
            }
        });
    }

    // ==========================================
    // FORGOT PASSWORD LOGIC
    // ==========================================
    let savedEmail = "";
    let savedOtp = "";

    // --- Step 1: Get Code ---
    if (step1Form) {
        step1Form.addEventListener('submit', async (e) => {
            e.preventDefault(); 
            savedEmail = document.getElementById('resetEmail').value;
            
            const response = await requestResetCode(savedEmail);

            if (response.success || response.statusCode === 200) {
                alert("Code sent to your email!");
                step1Form.classList.add('hidden');
                step2Form.classList.remove('hidden');
                document.getElementById('stepDesc').textContent = "Step 2: Enter the 6-digit code.";
            } else {
                alert("Failed: " + (response.message || "Unknown error"));
            }
        });
    }

    // --- Step 2: Verify Code ---
    if (step2Form) {
        step2Form.addEventListener('submit', async (e) => {
            e.preventDefault(); 
            savedOtp = document.getElementById('otpCode').value;
            
            const response = await verifyResetCode(savedEmail, savedOtp);

            if (response.success || response.statusCode === 200) {
                alert("Code verified!");
                step2Form.classList.add('hidden');
                step3Form.classList.remove('hidden');
                document.getElementById('stepDesc').textContent = "Step 3: Create a new password.";
            } else {
                alert("Invalid code.");
            }
        });
    }

    // --- Step 3: Reset Password ---
    if (step3Form) {
        step3Form.addEventListener('submit', async (e) => {
            e.preventDefault(); 
            const newPassword = document.getElementById('newPassword').value;
            
            const response = await resetPassword(savedEmail, savedOtp, newPassword);

            if (response.success || response.statusCode === 200) {
                alert("Password updated! Redirecting to login...");
                window.location.href = 'index.html'; 
            } else {
                alert("Failed to reset password.");
            }
        });
    }
});