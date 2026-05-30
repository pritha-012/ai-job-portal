import mongoose from 'mongoose';

const jobSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Job title is required'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Job description is required'],
    },
    company: {
      type: String,
      required: [true, 'Company name is required'],
    },
    location: {
      type: String,
      required: [true, 'Job location is required'],
    },
    skillsRequired: {
      type: [String],
      required: [true, 'At least one skill is required'],
    },
    experienceLevel: {
      type: String,
      enum: ['Fresher', 'Entry-Level', 'Mid-Level', 'Senior'],
      required: true,
    },
    salaryRange: {
      type: String, // e.g., "5 LPA - 8 LPA" or "$50k - $70k"
    },
    // 👇 THIS IS CRITICAL: It links the job to the Recruiter who posted it!
    postedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    }
  },
  { timestamps: true }
);

const Job = mongoose.model('Job', jobSchema);
export default Job;