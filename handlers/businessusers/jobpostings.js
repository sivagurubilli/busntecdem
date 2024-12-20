// const { JobPosting } = require('../../models');
// const { v4: uuidv4 } = require('uuid');

// /**
//  * @description 
//  * 
//  * @param req
//  * @param res
//  * @return {Promise<void>}
//  */


// const createJobPosting = async (req, res) => {
//     try {
//         const { company, title, location, experience, skills, description, jobRequirements, user_id  } = req.body;
        
     
//          const logo = req?.file;
//         console.log("logo get in backend ", logo)
//         if (!company || !title || !location || !experience || !skills || !description) {
//             return res.status(400).json({
//                 success: false,
//                 message: "All required fields must be filled",
//             });
//         }

      
//     const path = `${process.env.APP_NODE_URL}/bo-files/${logo}`;
          
//         const createdJobPosting = await JobPosting.create({
//             uuid: uuidv4(),
//             company: company || '',
//             title: title || '',
//             location: location || '',
//             experience: experience || '',
//             skills: skills || '', 
//             description: description || '',
//             logo: path,  
//             jobRequirements: jobRequirements || '',
//             user_id: user_id || ''
//         });

//         if (createdJobPosting) {
//             return res.status(200).json({
//                 success: true,
//                 message: "Job posting created successfully!",
//                 data: createdJobPosting
//             });
//         }

//         return res.status(400).json({
//             success: false,
//             message: "Failed to create job posting"
//         });

//     } catch (error) {
//         console.error('Error creating job posting:', error);

//         if (error.name === 'SequelizeValidationError') {
//             return res.status(400).json({
//                 success: false,
//                 message: "Validation error",
//                 details: error.errors.map(err => err.message)
//             });
//         }

//         return res.status(500).json({
//             success: false,
//             message: "Internal server error",
//             details: error.message
//         });
//     }
// };


// /**
//  * @description 
//  * 
//  * @param req
//  * @param res
//  * @return {Promise<void>}
//  */
// const getJobPostings = async (req, res) => {
//     try {
//         const jobPostings = await JobPosting.findAll({
//             where: { status: true }
//         });

//         if (jobPostings.length > 0) {
//             return res.status(200).json({
//                 success: true,
//                 message: "Job postings retrieved successfully!",
//                 data: jobPostings
//             });
//         }

//         return res.status(404).json({
//             success: false,
//             message: "No job postings found"
//         });

//     } catch (error) {
//         console.error('Error retrieving job postings:', error);

//         return res.status(500).json({
//             success: false,
//             message: "Internal server error",
//             details: error.message
//         });
//     }
// };

// module.exports = { createJobPosting, getJobPostings };


const { JobPosting } = require('../../models');
const { v4: uuidv4 } = require('uuid');

/**
 * @description 
 * 
 * @param req
 * @param res
 * @return {Promise<void>}
 */


const createJobPosting = async (req, res) => {
    try {
        const { company, title, location, experience, skills, description, jobRequirements, user_id ,ctc } = req.body;
        
        console.log("req body is............:", req.body)
        //  const {logo}  = req?.file;
        //  console.log("file", req.file)
        // console.log("logo get in backend ", logo)
        // if (!company || !title || !location || !experience || !skills || !description) {
        //     return res.status(400).json({
        //         success: false,
        //         message: "All required fields must be filled",
        //     });
        // }

      
    // const path = `${process.env.APP_NODE_URL}/bo-files/${logo}`;
          
        const createdJobPosting = await JobPosting.create({
            uuid: uuidv4(),
            company: company || '',
            title: title || '',
            location: location || '',
            experience: experience || '',
            skills: skills || '', 
            description: description || '',
            // logo: path || 'https://yourimageurl.com/path/to/logo1.png',  
            jobRequirements: jobRequirements || '',
            user_id: user_id || '',
            ctc: ctc || '',
        });

        if (createdJobPosting) {
            return res.status(200).json({
                success: true,
                message: "Job posting created successfully!",
                data: createdJobPosting
            });
        }

        return res.status(400).json({
            success: false,
            message: "Failed to create job posting"
        });

    } catch (error) {
        console.error('Error creating job posting:', error);

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
 * @description 
 * 
 * @param req
 * @param res
 * @return {Promise<void>}
 */
const getJobPostings = async (req, res) => {
    try {
        const jobPostings = await JobPosting.findAll({
            where: { status: true }
        });

        if (jobPostings.length > 0) {
            return res.status(200).json({
                success: true,
                message: "Job postings retrieved successfully!",
                data: jobPostings
            });
        }

        return res.status(404).json({
            success: false,
            message: "No job postings found"
        });

    } catch (error) {
        console.error('Error retrieving job postings:', error);

        return res.status(500).json({
            success: false,
            message: "Internal server error",
            details: error.message
        });
    }
};

module.exports = { createJobPosting, getJobPostings };
