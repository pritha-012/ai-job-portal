import Job from '../models/job.models.js';

export const saveJob = (jobData) => Job.create(jobData);
export const findJobsByRecruiter = (recruiterId) => Job.find({ postedBy: recruiterId });
export const findJobById = (id) => Job.findById(id).populate('postedBy', 'name email role');
export const updateJobById = (id, data) => Job.findByIdAndUpdate(id, data, { returnDocument: 'after' });
export const deleteJobById = (id) => Job.findByIdAndDelete(id);
export const countTotalJobsByRecruiter = (recruiterId) => Job.countDocuments({ postedBy: recruiterId });
// Note: Change `isActive: true` if your schema uses something else, like `status: 'active'`
export const countActiveJobsByRecruiter = (recruiterId) => Job.countDocuments({ postedBy: recruiterId, isActive: true });