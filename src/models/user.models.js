import mongoose from 'mongoose';
import { ROLES } from '../config/constants.config.js';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
      select: false, // Prevents password from being returned in queries by default
    },
    role: {
      type: String,
      enum: [ROLES.SEEKER, ROLES.RECRUITER, ROLES.ADMIN],
      default: ROLES.SEEKER,
    },
    
    // Seeker specific fields (Recruiters can just leave these empty)
    skills: {
      type: [String],
      default: [],
    },
    companyName: {
      // Recruiter specific field
      type: String,
      trim: true,
      required: function() { return this.role === ROLES.RECRUITER; }
    },
    resetPasswordOtp: {
      type: String,
      default: null,
    },
    resetPasswordExpires: {
      type: Date,
      default: null,
    },
   

  },
  { timestamps: true } // Automatically adds createdAt and updatedAt fields
);

const User = mongoose.model('User', userSchema);
export default User;