var express = require('express');
var router = express.Router();
const businessUserHandler = require('../../handlers/businessusers');
const bucketList = require('../../handlers/businessusers/bucketList');
const auth = require('../../common/auth');
const upload = require('../../middleware/UploadImage');
const externalSource = require('../../middleware/UploadResources');
const socialMedia = require('../../handlers/businessusers/socialmediaLinks');
const courseUploadHandler = require('../../handlers/businessusers/course_upload_files');
const boHandler = require('../../handlers/businessusers/bussiness_optimaHandler');
const OtpHandler = require('../../handlers/businessusers/sendotp');
const { default: axios } = require('axios');
const md5 = require('md5');
const businessusers = require('../../models').businessusers;
const { getFilesFromS3 } = require('../../middleware/awsUpload');

const searchjobs = require('../../handlers/businessusers/search_jobs');
const ApplyJob = require('../../handlers/businessusers/jobApply');
const uploadresumeController = require('../../handlers/businessusers/uploadResume');
// const uploadResume = require("../../middleware/uploadResume");
const applyJobResume = require('../../middleware/applyJobResume');
const uploadResume = require('../../middleware/uploadResume');
const uploadCompanyLogo = require('../../middleware/uploadCompanyLogo');
const {
  getPopularCourses,
} = require('../../handlers/businessusers/popularCourses');
const joinCommunity = require('../../handlers/businessusers/joinCommunity.controller');
const {
  linkedInLogin,
} = require('../../handlers/businessusers/linkedlInLogin');
const getFooterCourse = require('../../handlers/businessusers/footerCourse');
//Business user - Register
router.post('/signup', async (req, res) => {
  businessUserHandler.userRegisterHandler(req, res);
});
router.post('/users', async (req, res) => {
  businessUserHandler.getAllUsers(req, res);
});
// router.post('/users/:id', async (req, res) => {
//   businessUserHandler.updateUser(req, res);
// });
router.post("/linkedIn", linkedInLogin)

router.post('/boSignup', async (req, res) => {
  boHandler.boRegisterHandler(req, res);
});

//Login
router.post('/login', async (req, res) => {
  businessUserHandler.userLoginHandler(req, res);
});

router.post('/bologin', async (req, res) => {
  boHandler.boLoginHandler(req, res);
});

//verify Email
router.post('/verifyemail', async (req, res) => {
  businessUserHandler.verifyEmailHandler(req, res);
});
router.post('/editprofile', auth, async (req, res) => {
  businessUserHandler.editHandler(req, res);
});
router.post('/course/:type', auth, async (req, res) => {
  businessUserHandler.course(req, res);
});
router.post('/course_syllabus/:type', auth, async (req, res) => {
  businessUserHandler.course_syllabus(req, res);
});
router.post('/course_syllabus_video/:type', auth, async (req, res) => {
  businessUserHandler.course_syllabus(req, res);
});
router.post('/create_bucket_list', async (req, res) => {
  businessUserHandler.createBucketList(req, res);
});
router.post('/fetchbyroleMessage', async (req, res) => {
  businessUserHandler.fetchUserByRole(req, res);
});
router.post('/get_bucket_list', async (req, res) => {
  businessUserHandler.getBucketList(req, res);
});
router.post('/delete_bucket_list', async (req, res) => {
  bucketList.deleteBucketListItem(req, res);
});
// router.post('/create_job_post',uploadCompanyLogo.single("file"), async (req, res) => {
//   businessUserHandler.createJobPosting(req, res);
// });
router.post('/create_job_post', async (req, res) => {
  businessUserHandler.createJobPosting(req, res);
});
router.post('/get_job_post', async (req, res) => {
  businessUserHandler.getJobPostings(req, res);
});
router.post(
  '/apply_for_job',
  applyJobResume.single('file'),
  async (req, res) => {
    ApplyJob.saveJobApplication(req, res);
  }
);
router.post('/upload_resume', uploadresumeController.UploadResume);
router.post('/view_resume', uploadresumeController.ViewResume);
router.post('/create_service_request', async (req, res) => {
  businessUserHandler.createServiceRequest(req, res);
});

// router.post(
//   '/updateProfilePicture',
//   awsUpload.single('files'),
//   (req, res) => {
//     const videoUrl = req.file.location; // The S3 file URL

//     // businessUserHandler.updateProfilePictureController(req, res);
//   }
// );

router.post(
  '/updateProfilePicture',
  businessUserHandler.updateProfilePictureController
);
router.post('/getFilesFromS3', courseUploadHandler.getFilesFromS3);
router.post('/deleteFilesFromS3', courseUploadHandler.deleteFilesFromS3);

router.post('/bussEditProfile', async (req, res) => {
  businessUserHandler.bussEditProfile(req, res);
});

router.post('/sendotp', async (req, res) => {
  OtpHandler.sendotp(req, res);
});
router.post('/updatepassword', async (req, res) => {
  businessUserHandler.updatepassword(req, res);
});

router.post('/uploadSessions', upload.array('files'), async (req, res) => {
  businessUserHandler.sessionHandler(req, res);
});
router.post('/courseupload', upload.array('files'), async (req, res) => {
  businessUserHandler.courseuploadHandler(req, res);
});
router.post('/experience', async (req, res) => {
  businessUserHandler.experienceHandler(req, res);
});
router.post('/updateExperience', async (req, res) => {
  businessUserHandler.updateExperienceHandler(req, res);
});
router.post('/deleteExperience', async (req, res) => {
  businessUserHandler.deleteExperienceHandler(req, res);
});
router.post('/experiencedData', async (req, res) => {
  businessUserHandler.getExperienceDataHandler(req, res);
});
router.post('/createComment', async (req, res) => {
  businessUserHandler.createCommentHandler(req, res);
});
router.post('/getComments', async (req, res) => {
  businessUserHandler.getCommentHandler(req, res);
});
router.post('/updateComment', async (req, res) => {
  businessUserHandler.updateCommentHandler(req, res);
});
router.post('/deleteComment', async (req, res) => {
  businessUserHandler.deleteCommentHandler(req, res);
});
router.post('/updatelikes', async (req, res) => {
  businessUserHandler.likeHandler(req, res);
});
router.post('/updatedislikes', async (req, res) => {
  businessUserHandler.dislikeHandler(req, res);
});
router.post('/updateReplyLikes', async (req, res) => {
  businessUserHandler.replyLikeHandler(req, res);
});
router.post('/updateReplyDislikes', async (req, res) => {
  businessUserHandler.replyDislikeHandler(req, res);
});
router.post('/createReplies', async (req, res) => {
  businessUserHandler.createReplyHandler(req, res);
});
router.post('/getReplies', async (req, res) => {
  businessUserHandler.getRepliesHandler(req, res);
});
router.post('/updateReplies', async (req, res) => {
  businessUserHandler.updateReplyHandler(req, res);
});
router.post('/deleteReplies', async (req, res) => {
  businessUserHandler.deleteRepliesHandler(req, res);
});
router.post('/createUserNotes', async (req, res) => {
  businessUserHandler.createUserNotesHandler(req, res);
});
router.post('/getUserNotes', async (req, res) => {
  businessUserHandler.getUserNotesHandler(req, res);
});
router.post('/updateUserNotes', async (req, res) => {
  businessUserHandler.updateUserNotesHandler(req, res);
});
router.post('/deleteUserNotes', async (req, res) => {
  businessUserHandler.deleteUserNotesHandler(req, res);
});
router.post('/addUpdateSocialLinks', async (req, res) => {
  socialMedia(req, res);
});
router.post('/joinCommunity', async (req, res) => {
  joinCommunity(req, res);
});

router.post(
  '/uploadCourseThumbnail',
  upload.single('thumbImage'),
  async (req, res) => {
    courseUploadHandler.uploadCourseThumbnail(req, res);
  }
);
// router.post('/uploadCourseThumbnail', (req, res) => {
//   console.log('Route hit');
//   upload.single('thumbImage')(req, res, (err) => {
//     if (err) {
//       console.error('Error:', err);
//       return res.status(500).send('Middleware error');
//     }
//     console.log('File processed:', req.file);
//     res.status(200).send('Success');
//   });
// });

router.post(
  '/uploadCourseVideos',
  upload.array('course_preview'),
  async (req, res) => {
    courseUploadHandler.uploadCourseFiles(req, res);
  }
);

router.post('/uploadCourse', async (req, res) => {
  courseUploadHandler.uploadCourse(req, res);
});

router.post('/updateCourseContent', async (req, res) => {
  courseUploadHandler.updateCourseContent(req, res);
});

router.post('/updateCourseSection', async (req, res) => {
  courseUploadHandler.updateCourseSection(req, res);
});

router.post('/updateCourseList', async (req, res) => {
  courseUploadHandler.updateCourseList(req, res);
});
router.post('/fetchCoursesList', async (req, res) => {
  courseUploadHandler.fetAllCourseListByKeys(req, res);
});

router.post('/fetchSectionDetails', async (req, res) => {
  courseUploadHandler.fetchCourseSection(req, res);
});

router.post('/fetchCourseList', async (req, res) => {
  courseUploadHandler.fetchCourseList(req, res);
});

router.post('/searchCourses', async (req, res) => {
  courseUploadHandler.searchCourses(req, res);
});
router.post('/searchJobs', async (req, res) => {
  searchjobs.searchJobs(req, res);
});

router.post('/fetchRelatedCourseList', async (req, res) => {
  courseUploadHandler.fetchRelatedCourses(req, res);
});
// router.post('/fetchRelatedJobList', async (req, res) => {
//   courseUploadHandler.fetchRelatedJobs(req, res);
// });

router.post(
  '/uploadExternalResources',
  externalSource.array('extResources'),
  async (req, res) => {
    courseUploadHandler.uploadExternalResources(req, res);
  }
);

router.post('/reviewByUser', async (req, res) => {
  courseUploadHandler.createReviewByUser(req, res);
});

router.post('/updateReviewByLike', async (req, res) => {
  courseUploadHandler.updateReviewByLike(req, res);
});

router.post('/getReviews', async (req, res) => {
  courseUploadHandler.getReviews(req, res);
});

router.post('/commentReport', async (req, res) => {
  businessUserHandler.commentReportHandler(req, res);
});

router.post('/emailVerify', async (req, res) => {
  businessUserHandler.verifyEmail(req, res);
});
router.post('/emailotp', async (req, res) => {
  OtpHandler.emailotp(req, res);
});
router.post('/emailupdate', async (req, res) => {
  OtpHandler.emailupdate(req, res);
});
router.post('/bulkImportUsers', async (req, res) => {
  courseUploadHandler.bulkImportUsers(req, res);
});
router.post('/sendemailupdate', async (req, res) => {
  OtpHandler.sendemailupdate(req, res);
});
router.post('/sendemailwhenpurchase', async (req, res) => {
  OtpHandler.sendPurchaseNotification(req, res);
});
router.post('/sendmentornotification', async (req, res) => {
  OtpHandler.sendMentorNotification(req, res);
});
router.post('/getCourseProgress', async (req, res) => {
  courseUploadHandler.getCourseProgress(req, res);
});

router.get('/getPopularCourses', getPopularCourses);
router.get('/getFooterCourseLink', getFooterCourse);

router.get('/verify-email', async (req, res) => {
  const { token } = req.query;

  try {
    const user = await businessusers.findOne({
      where: { email_verify_token: token },
    });

    // if (user) {
    //   const now = Date.now();
    //   if (now > user.email_expiry) {
    //     return res
    //       .status(400)
    //       .send(responsesCommon.formatErrorMessage("email expired", 400, null));
    //   }}

    if (!user) {
      return res.status(400).send('Invalid token or user not found');
    }

    const loginResponse = await axios.post(
      `${process.env.APP_NODE_URL}/api/business/login`,
      {
        emailId: user.bus_email,
        loginType: user.login_type,
        password: user.password,
        userType: user.roles,
        emailverified: user.email_verified,
      }
    );

    user.email_verified = true;
    user.email_verify_token = null;
    await user.save();

    const { session } = loginResponse.data;

    const { password, email_verify_token, ...userData } = user.toJSON();

    return res.status(200).json({
      message: 'Email verified successfully!',
      token: session.token,
      data: userData, // Merge user data from the database and the login API response
    });
  } catch (error) {
    console.error('Error verifying email:', error);
  }
  return res.status(500).send('Internal server error');
});

module.exports = router;
