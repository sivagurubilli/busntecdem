const { uploadResume } = require("../../models");
const { v4: uuidv4 } = require("uuid");
const { uploadToS3, deleteFileFromS3 } = require("../../middleware/awsUpload");
const { getFilesFromS3 } = require("../../middleware/awsUpload");
const responsesCommon = require('../../common/response.common');
const getPreSignedUrl = require('../../middleware/awsUpload').getFilesFromS3;

const UploadResume = async (req, res) => {
  try {
    const { resume } = req.files;
    const { user_id } = req.body;

    if (!user_id) {
      return res.status(400).send(responsesCommon.formatErrorMessage('User ID is missing', null, 400, null));
    }

    const result = await uploadToS3(resume, '', 'resumes');
    if (!!result) {
      const { Location } = result;

      let existingResumeEntry = await uploadResume.findOne({ where: { user_id: user_id } });

      if (existingResumeEntry) {
        await uploadResume.update({ file: Location }, { where: { user_id: user_id } });
        
        // Get updated resume entry including the updatedAt field
        const updatedResume = await uploadResume.findOne({ where: { user_id: user_id }, attributes: ['file', 'updatedAt'] });
        
        const splitted = Location.split("/");
        const fileName = splitted[splitted.length - 1];
        const generatedUrl = getFilesFromS3(fileName, 'resumes');
        result['Location'] = generatedUrl;

        // Send updatedAt along with success message
        return res.status(200).send(responsesCommon.formatSuccessMessage('Resume updated successfully!', { Location: generatedUrl, updatedAt: updatedResume.updatedAt }, 200, null));
      } else {
        const newResumeEntry = await uploadResume.create({
          uuid: uuidv4(),
          user_id: user_id || "",
          file: Location || "",
        });

        if (!newResumeEntry || !newResumeEntry.user_id || !newResumeEntry.file) {
          return res.status(500).send(responsesCommon.formatErrorMessage('Failed to save data in the database', null, 500, null));
        }

        const splitted = Location.split("/");
        const fileName = splitted[splitted.length - 1];
        const generatedUrl = getFilesFromS3(fileName, 'resumes');
        result['Location'] = generatedUrl;

        // Send updatedAt along with success message
        return res.status(200).send(responsesCommon.formatSuccessMessage('Resume uploaded and saved successfully!', { Location: generatedUrl, updatedAt: newResumeEntry.updatedAt }, 200, null));
      }
    }

    return res.status(400).send(responsesCommon.formatErrorMessage('Failed to upload file', result, 400, null));
  } catch (error) {
    console.error(error);
    return res.status(500).send(responsesCommon.formatErrorMessage('An error occurred while uploading the resume', error, 500, null));
  }
};

const ViewResume = async (req, res) => {
  try {
    const { user_id } = req.body;

    if (!user_id) {
      return res.status(400).send(responsesCommon.formatErrorMessage('User ID is required', null, 400, null));
    }

    const userResume = await uploadResume.findOne({
      where: { user_id: user_id },
      attributes: ['file', 'updatedAt'], // Include updatedAt in the query
    });

    if (!userResume || !userResume.file) {
      return res.status(404).send(responsesCommon.formatErrorMessage('Resume not found for the given User ID', null, 404, null));
    }

    const fileLocation = userResume.file;

    const splitted = fileLocation.split("/");
    const fileName = splitted[splitted.length - 1];
    const Location = getFilesFromS3(fileName, 'resumes');

    return res.status(200).send(responsesCommon.formatSuccessMessage('Resume retrieved successfully', { Location, updatedAt: userResume.updatedAt }, 200, null));
  } catch (error) {
    console.error(error);
    return res.status(500).send(responsesCommon.formatErrorMessage('An error occurred while retrieving the resume', error, 500, null));
  }
};

module.exports = {
  UploadResume,
  ViewResume
};



