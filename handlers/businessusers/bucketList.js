const { userBucketList } = require('../../models');
const { v4: uuidv4 } = require('uuid');

/**
 * @description
 *
 *
 *
 * @param req
 * @param res
 * @return {Promise<void>}
 */

const createBucketList = async (req, res) => {
  try {
    const {
      uuid,
      youtube_id,
      course_id,
      mentor_id,
      category,
      title,
      thumbnail,
      status,
      user_id,
      flow_data = [],
    } = req.body;

    if (!category) {
      return res.status(400).json({
        success: false,
        message: 'Category is required',
      });
    }

    const createdBucketlist = await userBucketList.create({
      uuid: uuidv4(),
      youtube_id: youtube_id || '',
      course_id: course_id || '',
      mentor_id: mentor_id || '',
      category: category || '',
      title: title || '',
      thumbnail: thumbnail || '',
      status: status || true,
      user_id: user_id || '',
      flow_data: JSON.stringify(flow_data),
    });

    if (createdBucketlist) {
      return res.status(200).json({
        success: true,
        message: 'Bucket list created successfully!',
        data: createdBucketlist,
      });
    }

    return res.status(400).json({
      success: false,
      message: 'Failed to create Bucket list',
    });
  } catch (error) {
    console.error('Error creating Bucket list:', error);

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

const getBucketList = async (req, res) => {
  try {
    const bucketList = await userBucketList.findAll({
      where: { status: true, user_id: req.body.user_id },
    });

    if (bucketList.length >= 0) {
      return res.status(200).json({
        success: true,
        message: 'Bucket list retrieved successfully!',
        data: bucketList,
      });
    }

    return res.status(404).json({
      success: false,
      message: 'No Bucket list found',
    });
  } catch (error) {
    console.error('Error retrieving Bucket list:', error);

    return res.status(500).json({
      success: false,
      message: 'Internal server error',
      details: error.message,
    });
  }
};
const deleteBucketListItem = async (req, res) => {
  try {
    const { id } = req.body;
    console.log('id is', id);
    // Check if the bucket list item exists
    const bucketListItem = await userBucketList.findOne({ where: { id } });

    if (!bucketListItem) {
      return res.status(404).json({
        success: false,
        message: 'Bucket list item not found',
      });
    }

    // Delete the bucket list item
    await userBucketList.update({ status: false }, { where: { id } });

    return res.status(200).json({
      success: true,
      message: 'Bucket list item deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting bucket list item:', error);

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

module.exports = { createBucketList, deleteBucketListItem, getBucketList };
