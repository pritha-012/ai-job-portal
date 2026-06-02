import * as jobRepo from '../repositories/job.repositories.js';

export const createJobService = async (data) => await jobRepo.saveJob(data);
export const getRecruiterJobsService = async (id) => await jobRepo.findJobsByRecruiter(id);
export const updateJobService = async (id, data) => await jobRepo.updateJobById(id, data);
export const deleteJobService = async (id) => await jobRepo.deleteJobById(id);

export const getJobByIdService = async (id) => {
    return await jobRepo.findJobById(id);
};
export const getRecruiterStats = async (recruiterId) => {
    // 1. Fetch counts from the repository in parallel
    const [totalJobs, activeJobs] = await Promise.all([
        jobRepo.countTotalJobsByRecruiter(recruiterId),
        jobRepo.countActiveJobsByRecruiter(recruiterId)
    ]);

    // 2. Perform business logic calculations
    const inactiveJobs = totalJobs - activeJobs;

    // 3. Return the formatted data to the Controller
    return {
        totalJobs,
        activeJobs,
        inactiveJobs,
        totalApplicants: 0 // 🚧 Placeholder for the Application Engine
    };
};