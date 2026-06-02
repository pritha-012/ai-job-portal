import * as applicationService from '../services/application.services.js';
import { STATUS_CODES } from '../config/constants.config.js';

export const getRecruiterApplications = async (req, res) => {
    try {
        const recruiterId = req.user._id;
        const applicants = await applicationService.getRecruiterApplicationsService(recruiterId);

        res.status(STATUS_CODES.OK || 200).json({
            success: true,
            message: "Applicants retrieved successfully",
            data: applicants
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const updateApplicantStatus = async (req, res) => {
    try {
        const { id } = req.params; // Application ID
        const { status } = req.body; // 'interviewing', 'accepted', or 'rejected'
        const recruiterId = req.user._id;
        const validStatuses = ['Pending', 'Reviewed', 'Shortlisted', 'Rejected'];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({ 
                success: false, 
                message: `Invalid status. Must be one of: ${validStatuses.join(', ')}` 
            });
        }

        const updatedApplication = await applicationService.updateApplicantStatusService(id, status, recruiterId);

        res.status(STATUS_CODES.OK || 200).json({
            success: true,
            message: `Applicant status updated to ${status} successfully`,
            data: updatedApplication
        });
    } catch (error) {
        // If security check fails or app not found, handle errors gracefully
        const statusCode = error.message.includes("authorized") ? 403 : 400;
        res.status(statusCode).json({ success: false, message: error.message });
    }
};