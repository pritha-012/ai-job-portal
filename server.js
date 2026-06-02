import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import connectDB from './src/config/db.js'; 
import authRoutes from './src/routes/auth.routes.js';
import jobRoutes from './src/routes/job.routes.js'; 
import applicationRoutes from './src/routes/application.routes.js';

// Initialize Express App
const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(express.json());

app.use(cors({
    exposedHeaders: ['Authorization']
}));

// Test Route
app.get('/', (req, res) => {
    res.status(200).json({ 
        success: true, 
        message: 'Welcome to the AI Job Portal API Base Route!' 
    });
});
app.use('/api/auth', authRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/applications', applicationRoutes); // 👈 Add this line

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});