var express = require('express');
var router = express.Router();
const flowHandler = require('../../handlers/users/flow');

router.get('/', async function (req, res) {
  res.render('home');
});

router.post('/addToFlow', flowHandler.addToFlow);
router.post('/getIFlowData', flowHandler.getIFlowData);
router.post(
  '/moveCourseVideoToS3Bucket',
  flowHandler?.moveCourseVideoToS3Bucket
);
router.post('/updateIFlowData', flowHandler.updateToFlow);
router.post('/deleteIFlowData', flowHandler.deleteIFlowItem);
router.post('/deleteBucketItemFromFlow', flowHandler.deleteBucketItemFromFlow);
router.post(
  '/uploadCourseVideosS3Bucket',
  flowHandler.uploadCourseVideosS3Bucket
);
router.post('/uploadDeleteVideos', flowHandler.uploadDeleteVideos);

router.post('/updateIFlowTitle', flowHandler.updateIFlowTitle);
router.post('/deleteIFlowData', flowHandler.deleteIFlowData);
router.post('/updateProgressStatus', flowHandler.updateProgressStatus);
module.exports = router;
