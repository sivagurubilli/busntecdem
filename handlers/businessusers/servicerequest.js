const { ServiceRequest } = require('../../models'); 
const { v4: uuidv4 } = require('uuid');

/**
 * @description
 * 
 * @param req
 * @param res
 * @return {Promise<void>}
 */
const createServiceRequest = async (req, res) => {
    try {
        const { name, email, service, message } = req.body;

        if (!name || !email || !service || !message) {
            return res.status(400).json({
                success: false,
                message: "All required fields must be filled"
            });
        }

        
        const existingRequest = await ServiceRequest.findOne({ where: { email } });

        if (existingRequest) {
            return res.status(400).json({
                success: false,
                message: 'A request with this email already exists.'
            });
        }

        const createdServiceRequest = await ServiceRequest.create({
            uuid: uuidv4(),
            name,
            email,
            service,
            message,
        });

        if (createdServiceRequest) {
            return res.status(201).json({
                success: true,
                message: "Service request created successfully!",
                data: createdServiceRequest
            });
        }

        return res.status(400).json({
            success: false,
            message: "Failed to create service request"
        });

    } catch (error) {
        console.error('Error creating service request:', error);


        return res.status(500).json({
            success: false,
            message: "Internal server error",
            details: error.message
        });
    }
};


module.exports = { createServiceRequest };
