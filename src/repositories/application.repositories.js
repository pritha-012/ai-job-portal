import Application from '../models/application.models.js';

// 1. Fetch applicants for the recruiter's jobs
export const findApplicationsByJobIds = (jobIds) => {
    return Application.find({ jobId: { $in: jobIds } })
        .populate('jobId', 'title companyName') // 👈 Changed to jobId
        .populate('applicantId', 'name email skills') // 👈 Changed to applicantId
        .sort({ createdAt: -1 });
};

// 2. Fetch a specific application and its job details
export const findApplicationByIdWithJob = (id) => {
    return Application.findById(id).populate('jobId', 'postedBy'); // 👈 Changed to jobId
};

// 3. Update status
export const updateStatusById = (id, status) => {
    return Application.findByIdAndUpdate(
        id, 
        { status }, 
        { new: true, runValidators: true }
    );
};

// 4. Count total applications for stats
export const countApplicationsByJobIds = (jobIds) => {
    return Application.countDocuments({ jobId: { $in: jobIds } }); // 👈 Changed to jobId
};