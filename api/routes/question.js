var express = require("express");
var router = express.Router();
const questionHandler = require("../../handlers/questions/question");


router.post('/saveUserAnswers', questionHandler.saveUserQuestion)
router.post('/fetchUserQuestion', questionHandler.fetchUserQuestion)

module.exports = router;