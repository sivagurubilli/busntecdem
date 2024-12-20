'use strict';

const userRegisterHandler = require('./register');
const getAllUsers = require('./allusersdetails');
// const updateUser = require('./allusersdetails');
const verifyEmailHandler = require('./verifyemail');
const userLoginHandler = require('./login');
const editHandler = require('./edit');
const course = require('./course');

// const otphandler = require("./sendotp");
const updatepassword = require('./updatepassword');
const bussEditProfile = require('./bussEditProfile');
const { updateProfilePictureController } = require('./course_syllabus');
const course_syllabusHandler =
  require('./course_syllabus').course_syllabusHandler;
const courseuploadHandler = require('./courseupload');
const sessionHandler = require('./sessions');
const experienceHandler = require('./addExperiences');
const getExperienceDataHandler = require('./getExperienceData');
const updateExperienceHandler = require('./updateExperienceHandler');
const deleteExperienceHandler = require('./deleteExperienceHandler');
const createCommentHandler = require('./createCommentHandler');
const getCommentHandler = require('./getCommentHandler');
const updateCommentHandler = require('./updateCommentHandler');
const deleteCommentHandler = require('./deleteCommentHandler');
const createReplyHandler = require('./createReplyHandler');
const getRepliesHandler = require('./getRepliesHandler');
const updateReplyHandler = require('./updateReplyHandler');
const deleteRepliesHandler = require('./deleteRepliesHandler');
const { likeHandler } = require('./likeHandler');
const { dislikeHandler } = require('./likeHandler');
const commentReportHandler = require('./commentReportHandler');
const { replyLikeHandler } = require('./likeHandler');
const { replyDislikeHandler } = require('./likeHandler');
const verifyEmail = require('./emailVerify');
const { createUserNotesHandler } = require('./userNotesHandlers');
const { getUserNotesHandler } = require('./userNotesHandlers');
const { updateUserNotesHandler } = require('./userNotesHandlers');
const { deleteUserNotesHandler } = require('./userNotesHandlers');
const { createBucketList, getBucketList } = require('./bucketList');
const { createJobPosting, getJobPostings } = require('./jobpostings');
const { createServiceRequest } = require('./servicerequest');
const fetchUserByRole = require('./fetchUserByRole');

module.exports = {
  fetchUserByRole,
  userRegisterHandler,
  getAllUsers,
  // updateUser,j
  verifyEmailHandler,
  userLoginHandler,
  editHandler,
  course,
  course_syllabusHandler,
  updateProfilePictureController,
  updatepassword,
  bussEditProfile,
  courseuploadHandler,
  sessionHandler,
  experienceHandler,
  getExperienceDataHandler,
  updateExperienceHandler,
  deleteExperienceHandler,
  createCommentHandler,
  getCommentHandler,
  updateCommentHandler,
  deleteCommentHandler,
  createReplyHandler,
  getRepliesHandler,
  updateReplyHandler,
  deleteRepliesHandler,
  likeHandler,
  dislikeHandler,
  commentReportHandler,
  replyLikeHandler,
  replyDislikeHandler,
  verifyEmail,
  createUserNotesHandler,
  getUserNotesHandler,
  updateUserNotesHandler,
  deleteUserNotesHandler,
  createBucketList,
  getBucketList,
  createJobPosting,
  getJobPostings,
  createServiceRequest,
};
