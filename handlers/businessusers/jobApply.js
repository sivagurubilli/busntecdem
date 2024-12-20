const { JobApply } = require("../../models");
const { v4: uuidv4 } = require("uuid");
const { default: axios } = require("axios");
const nodemailer = require("nodemailer");
const md5 = require("md5");
const responsesCommon = require("../../common/response.common");

const saveJobApplication = async (req, res) => {
  try {
    const { experience, skills, education, user_id, touserId, title, first_name, last_name } = req.body;

    // console.log("req.body", req.body);

    const { filename } = req?.file;

    if (!experience || !skills || !education) {
      return res.status(400).json({
        success: false,
        message: "All required fields must be filled",
      });
    }
    const path = `${process.env.APP_NODE_URL}/bo-files/${filename}`;
    const saveJobApplication = await JobApply.create({
      uuid: uuidv4(),
      experience: experience || 0,
      skills: skills || "",
      education: education || "",
      user_id: user_id || "",
      file: path || "",
      user_id: user_id || "",
    });

    if (saveJobApplication) {
      await axios.post(
        `${process.env.APP_NODE_URL}/api/user/createNotifications`,
        {
          userId: touserId,
          title: `New application received for ${title} from ${first_name} ${last_name}`,
          org: "tecdemy",
          external_url_title: "",
          external_url: ``,
          category: "update",
        }
      );

      return res.status(200).json({
        success: true,
        message: "Job application submitted successfully!",
        data: saveJobApplication,
      });
    }

    return res.status(400).json({
      success: false,
      message: "Failed to submit job application",
    });
  } catch (error) {
    console.error("Error submitting job application:", error);

    if (error.name === "SequelizeValidationError") {
      return res.status(400).json({
        success: false,
        message: "Validation error",
        details: error.errors.map((err) => err.message),
      });
    }

    return res.status(500).json({
      success: false,
      message: "Internal server error",
      details: error.message,
    });
  }
};

module.exports = {
  saveJobApplication,
};
