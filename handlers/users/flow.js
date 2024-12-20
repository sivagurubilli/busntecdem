const userFlowTable = require('../../models').userFlow;
const { default: axios } = require('axios');
const responsesCommon = require('../../common/response.common');
const {
  CourseSections,
  courseUploads,
  userCourseProgress,
} = require('../../models');
const {
  uploadToS3,
  getFilesFromS3,
  deleteFileFromS3,
} = require('../../middleware/awsUpload');
const fs = require('fs');
const path = require('path');
const addToFlow = async (req, res) => {
  try {
    const { title, user_id, data = [] } = req.body;

    const createdFlow = await userFlowTable.create({
      title,
      user_id,
      flow_data: JSON.stringify(data),
    });
    if (!!createdFlow) {
      return res
        .status(200)
        .send(
          responsesCommon.formatSuccessMessage('IFlow is created!', 400, null)
        );
    }
    return res
      .status(400)
      .send(
        responsesCommon.formatErrorMessage('Failed to create IFlow!', 400, null)
      );
  } catch (error) {
    console.error(error);
  }
};
const updateIFlowTitle = async (req, res) => {
  try {
    const { user_id, iFlowId, title } = req.body;

    // Check if the necessary parameters are provided
    if (!iFlowId || !title) {
      return res
        .status(400)
        .send(
          responsesCommon.formatErrorMessage(
            'iFlow ID and title are required!',
            400,
            null
          )
        );
    }

    // Fetch the iFlow for the given user_id and iFlowId
    const existingFlow = await userFlowTable.findOne({
      where: { user_id, id: iFlowId },
    });

    if (!existingFlow) {
      return res
        .status(404)
        .send(
          responsesCommon.formatErrorMessage('iFlow not found!', 404, null)
        );
    }

    // Update the title of the iFlow
    existingFlow.title = title;

    // Save the updated title back to the database
    await existingFlow.save();

    return res
      .status(200)
      .send(
        responsesCommon.formatSuccessMessage(
          'iFlow title updated successfully!',
          200,
          null
        )
      );
  } catch (error) {
    console.error('Error updating iFlow title:', error);
    return res
      .status(500)
      .send(
        responsesCommon.formatErrorMessage(
          'Failed to update iFlow title!',
          500,
          null
        )
      );
  }
};

const updateToFlow = async (req, res) => {
  try {
    const { user_id, data = [], iFlowIds = [] } = req.body;

    // Check if the user has selected any iFlows
    if (!iFlowIds.length) {
      return res
        .status(400)
        .send(
          responsesCommon.formatErrorMessage(
            'No iFlow IDs provided!',
            400,
            null
          )
        );
    }

    // Fetch all the selected iFlows for this user
    const existingFlows = await userFlowTable.findAll({
      where: { user_id, id: iFlowIds },
    });

    if (!existingFlows.length) {
      return res
        .status(404)
        .send(
          responsesCommon.formatErrorMessage(
            'No iFlows found for the specified IDs!',
            404,
            null
          )
        );
    }

    // Iterate over each flow and update the data
    for (const flow of existingFlows) {
      let existingFlowData = [];

      // Parse the existing flow data
      try {
        existingFlowData = flow.flow_data ? JSON.parse(flow.flow_data) : [];
      } catch (error) {
        console.error('Error parsing existing flow_data:', error);
      }

      // Filter the new data to exclude items that already exist in the flow_data
      const newDataToAdd = data.filter((newItem) => {
        return !existingFlowData.some(
          (existingItem) => existingItem.id === newItem.id
        );
      });

      // If there's new data to add, append it
      if (newDataToAdd.length > 0) {
        const updatedFlowData = [...existingFlowData, ...newDataToAdd];

        // Update the flow data
        flow.flow_data = JSON.stringify(updatedFlowData);

        // Save the updated flow back to the database
        await flow.save();
      }
    }

    return res
      .status(200)
      .send(
        responsesCommon.formatSuccessMessage(
          'iFlows updated successfully!',
          200,
          null
        )
      );
  } catch (error) {
    console.error('Error updating iFlows:', error);
    return res
      .status(500)
      .send(
        responsesCommon.formatErrorMessage(
          'Failed to update iFlows!',
          500,
          null
        )
      );
  }
};

const getIFlowData = async (req, res) => {
  try {
    const { user_id } = req.body;
    const fetchedFlows = await userFlowTable.findAll({
      where: { user_id, status: true },
      order: [['id', 'desc']],
    });

    if (!!fetchedFlows) {
      const updatedData = await Promise.all(
        fetchedFlows.map(async (items) => {
          const dataValues = items?.dataValues;
          const jsonFlowData = JSON.parse(dataValues.flow_data);
          const courseIds = jsonFlowData.map((video) => video?.id);
          const sections = await CourseSections.findAll({
            where: { course_id: courseIds },
            attributes: ['id', 'course_id'],
          });
          const updatedSections = sections.map((items) => items?.dataValues);
          const sectionIds = sections.map((items) => items?.id);
          const subSections = await courseUploads.findAll({
            where: { section_id: sectionIds },
            attributes: ['id', 'video_length', 'section_id'],
          });
          const updatedSubSection = subSections.map((items) => ({
            ...items?.dataValues,
            totalVideoLength: items?.video_length,
          }));
          const subSectionIds = updatedSubSection.map((items) => items?.id);
          //fetch user progress db
          const progressData = await userCourseProgress.findAll({
            where: { upload_id: subSectionIds, user_id },
            attributes: ['id', 'upload_id', 'video_progress'],
          });
          //update subsection with user progress data;
          const updatedSubSectionWithProgress = updatedSubSection.map(
            (subSection) => {
              const progress =
                progressData.find(
                  (item) => item?.upload_id == subSection?.id
                ) || {};
              return { ...subSection, progress };
            }
          );
          const updateSectionWithSubSection = updatedSections.map((section) => {
            return {
              ...section,
              subSections: updatedSubSectionWithProgress.filter(
                (subSection) => subSection.section_id == section?.id
              ),
            };
          });
          const updatedJsonFlowDataWithSectionSubSectionData = jsonFlowData.map(
            (jsonData) => {
              return {
                ...jsonData,
                sectionDataWithProgress: updateSectionWithSubSection.filter(
                  (section) => section?.course_id == jsonData.id
                ),
              };
            }
          );
          dataValues['flow_data'] =
            updatedJsonFlowDataWithSectionSubSectionData;
          return dataValues;
        })
      );
      return res
        .status(200)
        .send(
          responsesCommon.formatSuccessMessage(
            'IFlow fetch successfully!',
            updatedData,
            400,
            null
          )
        );
    }
    return res
      .status(400)
      .send(
        responsesCommon.formatErrorMessage(
          'Failed to fetch IFlow!',
          [],
          400,
          null
        )
      );
  } catch (error) {
    console.error(error);
    return res
      .status(400)
      .send(
        responsesCommon.formatErrorMessage(
          'Failed to fetch IFlow!',
          [],
          400,
          null
        )
      );
  }
};
const deleteIFlowItem = async (req, res) => {
  try {
    const { id } = req.body;
    console.log('id is', id);
    // Check if the bucket list item exists
    const iFlowItem = await userFlowTable.findOne({ where: { id } });

    if (!iFlowItem) {
      return res.status(404).json({
        success: false,
        message: 'IFlow list item not found',
      });
    }

    // Delete the bucket list item
    await iFlowItem.update({ status: false }, { where: { id } });

    return res.status(200).json({
      success: true,
      message: 'IFlow item deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting IFlow item:', error);

    if (error.name === 'SequelizeValidationError') {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        details: error.errors.map((err) => err.message),
      });
    }

    return res.status(500).json({
      success: false,
      message: 'Internal server error',
      details: error.message,
    });
  }
};
const deleteBucketItemFromFlow = async (req, res) => {
  try {
    const { iFlowId, bucketItemId } = req.body;
    console.log('req.body is', req.body);
    // Fetch the iFlow by its ID
    const flow = await userFlowTable.findOne({ where: { id: iFlowId } });

    if (!flow) {
      return res
        .status(404)
        .send(
          responsesCommon.formatErrorMessage('IFlow not found!', 404, null)
        );
    }

    // Parse the existing flow data (JSON)
    let flowData = [];
    try {
      flowData = flow.flow_data ? JSON.parse(flow.flow_data) : [];
    } catch (error) {
      console.error('Error parsing flow data:', error);
      return res
        .status(500)
        .send(
          responsesCommon.formatErrorMessage(
            'Error parsing flow data!',
            500,
            null
          )
        );
    }

    // Find the bucket item to delete based on its ID
    const updatedFlowData = flowData.filter((item) => item.id !== bucketItemId);

    // Check if the item was found and removed
    if (flowData.length === updatedFlowData.length) {
      return res
        .status(404)
        .send(
          responsesCommon.formatErrorMessage(
            'Bucket list item not found!',
            404,
            null
          )
        );
    }

    // Update the flow_data field with the new data
    flow.flow_data = JSON.stringify(updatedFlowData);

    // Save the updated flow back to the database
    await flow.save();

    return res
      .status(200)
      .send(
        responsesCommon.formatSuccessMessage(
          'Bucket list item deleted successfully!',
          200,
          null
        )
      );
  } catch (error) {
    console.error('Error deleting bucket list item from iFlow:', error);
    return res
      .status(500)
      .send(
        responsesCommon.formatErrorMessage(
          'Failed to delete bucket list item!',
          500,
          null
        )
      );
  }
};

function findFileByName(directory, fileName) {
  return new Promise((resolve, reject) => {
    // Read the contents of the directory
    fs.readdir(directory, (err, files) => {
      if (err) {
        return reject(`Unable to read directory: ${err.message}`);
      }

      // Filter files by matching name
      const matchingFiles = files.filter((file) => file == fileName);
      // Return full paths of matching files
      const fullPaths = matchingFiles.map((file) => path.join(directory, file));
      resolve({ files, filePath: fullPaths[0] });
    });
  });
}

const moveCourseVideoToS3Bucket = async (req, res) => {
  try {
    //fetch all videos address from table
    const allVideos = await courseUploads.findAll();
    if (!!allVideos) {
      //loop through each video and upload to s3 bucket
      allVideos.forEach(async (video, idx) => {
        //fetch file name from object
        if (idx > 0) {
          const splittedUrl = video?.course_video.split('/');
          const videoFileName = splittedUrl[splittedUrl.length - 1];
          const { files, filePath } = await findFileByName(
            'upload/images',
            videoFileName
          );
          if (!!filePath) {
            fs.readFile(filePath, async (err, fileData) => {
              if (err) {
                return reject(`Error reading file: ${err.message}`);
              }
              const file = { data: fileData, name: videoFileName };
              const result = await uploadToS3(
                file,
                process.env.S3_BUCKET_NAME,
                'videos'
              );
              if (!!result) {
                const updateVideoAddress = await courseUploads.update(
                  { course_video: result.Location },
                  {
                    where: { id: video.id },
                  }
                );
              }
            });
          }
        }
      });
    }
  } catch (error) {
    console.error(error);
  }
};

const uploadCourseVideosS3Bucket = async (req, res) => {
  try {
    const { courseVideos } = req.files;
    if (!!courseVideos) {
      const result = await uploadToS3(
        courseVideos,
        process.env.S3_BUCKET_NAME,
        'videos'
      );
      if (!!result) {
        const { Location } = result;
        const splitted = Location.split('/');
        const fileName = splitted[splitted.length - 1];
        const generatedUrl = getFilesFromS3(fileName, 'videos');
        result['Location'] = generatedUrl;
        return res
          .status(200)
          .send(
            responsesCommon.formatSuccessMessage(
              'File uploaded successfully!',
              result,
              200,
              null
            )
          );
      }
      return res
        .status(400)
        .send(
          responsesCommon.formatErrorMessage(
            'Failed to upload file',
            result,
            400,
            null
          )
        );
    }
  } catch (error) {
    console.error(error);
  }
};

const uploadDeleteVideos = async (req, res) => {
  try {
    const { fileUrl } = req.body;
    if (!!fileUrl) {
      const response = await deleteFileFromS3(fileUrl);
      if (!!response) {
        return res
          .status(200)
          .send(
            responsesCommon.formatSuccessMessage(
              'File deleted successfully!',
              [],
              null,
              null,
              null,
              200
            )
          );
      }
      return res
        .status(400)
        .send(
          responsesCommon.formatErrorMessage('Failed to delete!', 400, null)
        );
    }
  } catch (error) {
    console.error(error);
  }
};
const deleteIFlowData = async (req, res) => {
  try {
    const { user_id, iFlowId } = req.body;

    // Check if both user_id and iFlowId are provided
    if (!user_id || !iFlowId) {
      return res
        .status(400)
        .send(
          responsesCommon.formatErrorMessage(
            'User ID and iFlow ID are required!',
            400,
            null
          )
        );
    }

    // Find the iFlow that belongs to the user and has the given iFlowId
    const iFlow = await userFlowTable.findOne({
      where: { user_id, id: iFlowId },
    });

    if (!iFlow) {
      return res
        .status(404)
        .send(
          responsesCommon.formatErrorMessage('iFlow not found!', 404, null)
        );
    }

    // Set the status field to false (mark the iFlow as inactive)
    iFlow.status = false;

    // Save the changes back to the database
    await iFlow.save();

    return res
      .status(200)
      .send(
        responsesCommon.formatSuccessMessage(
          'iFlow marked as inactive successfully!',
          200,
          null
        )
      );
  } catch (error) {
    console.error('Error marking iFlow as inactive:', error);
    return res
      .status(500)
      .send(
        responsesCommon.formatErrorMessage(
          'Failed to mark iFlow as inactive!',
          500,
          null
        )
      );
  }
};
const updateProgressStatus = async (req, res) => {
  try {
    const { iFlowId, videoId, progress_status } = req.body;

    // Find the iFlow in the database
    const iFlow = await userFlowTable.findOne({
      where: { id: iFlowId },
    });

    if (!iFlow) {
      return res.status(404).json({ message: 'iFlow not found' });
    }

    // Parse the flow_data (assuming it's stored as JSON)
    let flowData = JSON.parse(iFlow.flow_data);

    // Update progress_status for the YouTube video
    flowData = flowData.map((item) => {
      if (item.id === videoId && item.type === 'videos') {
        return {
          ...item,
          progress_status, // Set the new progress_status
        };
      }
      return item;
    });

    // Save the updated flow_data back to the database
    iFlow.flow_data = JSON.stringify(flowData);
    await iFlow.save();

    return res.status(200).json({ message: 'Progress updated successfully' });
  } catch (error) {
    console.error('Error updating progress:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = {
  addToFlow,
  getIFlowData,
  updateToFlow,
  moveCourseVideoToS3Bucket,
  uploadCourseVideosS3Bucket,
  uploadDeleteVideos,
  deleteIFlowItem,
  deleteBucketItemFromFlow,
  updateIFlowTitle,
  deleteIFlowData,
  updateProgressStatus,
};
