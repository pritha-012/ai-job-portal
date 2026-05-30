import * as jobService from '../services/job.services.js';

export const createJob = async (req, res) => {
    try {
        const job = await jobService.createJobService({ ...req.body, postedBy: req.user._id });
        res.status(201).json({ success: true, data: job });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

export const getMyJobs = async (req, res) => {
    const jobs = await jobService.getRecruiterJobsService(req.user._id);
    res.status(200).json({ success: true, data: jobs });
};
export const updateJob = async (req, res) => {
    try {
        // 1. Find the job first to check ownership
        const job = await jobService.getJobByIdService(req.params.id);

        if (!job) return res.status(404).json({ success: false, message: "Job not found" });

        // 2. Security Check: Notice the ._id added right after postedBy! 👇
        if (job.postedBy._id.toString() !== req.user._id.toString()) {
            return res.status(403).json({ success: false, message: "Not authorized to update this job" });
        }

        // 3. Update the job
        const updatedJob = await jobService.updateJobService(req.params.id, req.body);
        res.status(200).json({ success: true, message: "Job updated successfully" });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

export const deleteJob = async (req, res) => {
    try {
        const job = await jobService.getJobByIdService(req.params.id);

        if (!job) return res.status(404).json({ success: false, message: "Job not found" });

        // Security Check: Notice the ._id added right after postedBy! 👇
        if (job.postedBy._id.toString() !== req.user._id.toString()) {
            return res.status(403).json({ success: false, message: "Not authorized to delete this job" });
        }

        await jobService.deleteJobService(req.params.id);
        res.status(200).json({ success: true, message: "Job deleted successfully" });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};


// src/controllers/jobController.js

export const getJobById = async (req, res) => {
    try {
        const jobId = req.params.id;

        // 1. Fetch the job from the service layer
        const job = await jobService.getJobByIdService(jobId);

        // 2. If the database returns null, the job doesn't exist (or was deleted)
        if (!job) {
            return res.status(404).json({ 
                success: false, 
                message: "Job not found" 
            });
        }

        // 3. Return the job data to the frontend
        res.status(200).json({ 
            success: true, 
            data: job 
        });

    } catch (error) {
        // If the user passes a malformed MongoDB ID (not 24 characters), it throws a CastError.
        // We catch that here and send a clean 400 error instead of crashing the server.
        if (error.name === 'CastError') {
            return res.status(400).json({ 
                success: false, 
                message: "Invalid Job ID format" 
            });
        }
        
        res.status(500).json({ 
            success: false, 
            message: "Server error while fetching job" 
        });
    }
};