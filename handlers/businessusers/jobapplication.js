const { JobApplication } = require('../../models');
const { v4: uuidv4 } = require('uuid');

/**
 * @description 
 * 
 * @param req
 * @param res
 * @return {Promise<void>}
 */
const createJobApplication = async (req, res) => {
    try {
        const { experience, skills, education, file, user_id } = req.body;

        if (!experience || !skills || !education || !file) {
            return res.status(400).json({
                success: false,
                message: "All required fields must be filled"
            });
        }

        const createdJobApplication = await JobApplication.create({
            uuid: uuidv4(),
            experience: experience || 0,
            skills: skills || '',
            education: education || '',
            file: file || '',
            user_id: user_id || '',
        });

        if (createdJobApplication) {
            return res.status(200).json({
                success: true,
                message: "Job application submitted successfully!",
                data: createdJobApplication
            });
        }

        return res.status(400).json({
            success: false,
            message: "Failed to submit job application"
        });

    } catch (error) {
        console.error('Error submitting job application:', error);

        if (error.name === 'SequelizeValidationError') {
            return res.status(400).json({
                success: false,
                message: "Validation error",
                details: error.errors.map(err => err.message)
            });
        }

        return res.status(500).json({
            success: false,
            message: "Internal server error",
            details: error.message
        });
    }
};

/**
 * @description Retrieve all job applications
 * 
 * @param req
 * @param res
 * @return {Promise<void>}
 */
const getJobApplications = async (req, res) => {
    try {
        const jobApplications = await JobApplication.findAll({
            where: { status: 'pending' }
        });

        if (jobApplications.length > 0) {
            return res.status(200).json({
                success: true,
                message: "Job applications retrieved successfully!",
                data: jobApplications
            });
        }

        return res.status(404).json({
            success: false,
            message: "No job applications found"
        });

    } catch (error) {
        console.error('Error retrieving job applications:', error);

        return res.status(500).json({
            success: false,
            message: "Internal server error",
            details: error.message
        });
    }
};

module.exports = { createJobApplication, getJobApplications };
