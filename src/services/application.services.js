import * as applicationRepo from '../repositories/application.repositories.js';
import * as jobRepo from '../repositories/job.repositories.js';

export const getRecruiterApplicationsService = async (recruiterId) => {
    // 1. Fetch all jobs posted by this specific recruiter
    const recruiterJobs = await jobRepo.findJobsByRecruiter(recruiterId);
    
    if (!recruiterJobs || recruiterJobs.length === 0) {
        return [];
    }

    // 2. Extract just the ObjectIds of those jobs
    const jobIds = recruiterJobs.map(job => job._id);

    // 3. Query the repository for any applications tied to those Job IDs
    return await applicationRepo.findApplicationsByJobIds(jobIds);
};

export const updateApplicantStatusService = async (applicationId, status, recruiterId) => {
    const application = await applicationRepo.findApplicationByIdWithJob(applicationId);
    
    if (!application) {
        throw new Error("Application not found");
    }

    // 🚨 SECURITY CHECK: Notice the .jobId here!
    if (application.jobId.postedBy.toString() !== recruiterId.toString()) {
        throw new Error("Not authorized to update status for this applicant");
    }

    return await applicationRepo.updateStatusById(applicationId, status);
};

