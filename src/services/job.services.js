import * as jobRepo from '../repositories/job.repositories.js';

export const createJobService = async (data) => await jobRepo.saveJob(data);
export const getRecruiterJobsService = async (id) => await jobRepo.findJobsByRecruiter(id);
export const updateJobService = async (id, data) => await jobRepo.updateJobById(id, data);
export const deleteJobService = async (id) => await jobRepo.deleteJobById(id);

export const getJobByIdService = async (id) => {
    return await jobRepo.findJobById(id);
};