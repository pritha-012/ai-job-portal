import express from 'express';
import { register, login,getCode, 
    verifyCode, 
    resetPassword, getMe } from '../controllers/auth.controllers.js';
import { validateRegister, validateLogin } from '../validations/auth.validations.js';
import { responseTransformer } from "../transformers/response.transformers.js";
import { protect,authorizeRoles } from '../middlewares/auth.middlewares.js';

const router = express.Router();

router.post('/register', validateRegister, register,responseTransformer);
router.post('/login', validateLogin, login,responseTransformer);
router.post('/forgot-password/getcode',getCode, responseTransformer);

// Step 2: Verify the 6-digit OTP
router.post('/forgot-password/verifycode', verifyCode, responseTransformer);

// Step 3: Set the new password
router.post('/forgot-password/resetcode',resetPassword, responseTransformer);
router.get('/me', protect,authorizeRoles('recruiter'), getMe, responseTransformer);


export default router;




