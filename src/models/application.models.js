import mongoose from 'mongoose';

const applicationSchema = new mongoose.Schema(
  {
    jobId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Job',
      required: true,
    },
    applicantId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    resumeUrl: {
      type: String,
      required: true, // Path to the uploaded PDF file
    },
    coverLetter: {
      type: String,
      trim: true, // Automatically removes accidental blank spaces at the beginning or end
      default: "", // Ensures it saves as an empty string instead of 'null' if they skip it
    },
    aiMatchScore: {
      type: Number,
      min: 0,
      max: 100,
      default: null, // Will be updated once the LLM processes the resume
    },
    missingSkills: {
      type: [String],
      default: [], // Populated by the LLM
    },
    aiFeedback: {
      type: String,
      default: "", // Short summary from the LLM on why they fit or don't fit
    },
    // ---------------------------
    status: {
      type: String,
      enum: ['Pending', 'Reviewed', 'Shortlisted', 'Rejected'],
      default: 'Pending',
    }
  },
  { timestamps: true }
);

// Prevent a user from applying to the same job twice
applicationSchema.index({ jobId: 1, applicantId: 1 }, { unique: true });

const Application = mongoose.model('Application', applicationSchema);
export default Application;