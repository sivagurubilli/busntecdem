var express = require("express");
var router = express.Router();
// const userHandlers = require("../../handlers/users");
const userHandlers = require("../../handlers/businessusers/login")
const userProgressHandler = require("../../handlers/users/userProgressHandler");
const sessionHandler = require("../../handlers/users/sessionHandler")
const fileHandler = require("../../handlers/users/fileHandler");
const fetchUser = require("../../handlers/users/fetchuser");
const auth = require("../../common/auth");
const meetingHandler = require('../../handlers/businessusers/meeting')
const { capturePayment, createOrder } = require("../../Paypal-api");
//Student - Register
router.post("/signup", async (req, res) => {
  userHandlers.signUpHandler(req, res);
});
//Student- Login
router.post("/login", async (req, res) => {
  userHandlers.userLoginHandler(req, res);
});
router.post("/sendotp", async (req, res) => {
  userHandlers.userLoginHandler(req, res);
});

//Verify Email
router.post("/verifyemail", async (req, res) => {
  userHandlers.verifyEmailHandler(req, res);
});
router.post("/fetchbyrole", async (req, res) => {
  fetchUser.filterByRole(req, res);
});
router.post("/bucketlist/:type", auth, async (req, res) => {
  userHandlers.bucketlistHandler(req, res);
});

router.post("/updateCreateCourseProgress", auth, async (req, res) => {
  userProgressHandler.updateProgressOfUser(req, res);
});

router.post("/addToTrash", async (req, res) => {
  userProgressHandler.handleAddToTrash(req, res);
});

router.post("/getTrashData", async (req, res) => {
  userProgressHandler.getTrashData(req, res);
});

router.post("/updateTrashData", async (req, res) => {
  userProgressHandler.updateTrashData(req, res);
});

router.post("/restoreData", async (req, res) => {
  userProgressHandler.restoreData(req, res);
});

router.post("/saveUserProgress", async (req, res) => {
  userProgressHandler.saveUserProgress(req, res);
});

router.post("/addToCart_v1", async (req, res) => {
  userProgressHandler.addToCartV1(req, res);
});

router.post("/getCartItems_v1", async (req, res) => {
  userProgressHandler.getCartItems_v1(req, res);
});

router.post("/addToWishlist_v1", async (req, res) => {
  userProgressHandler.addToWishlist_v1(req, res);
});

router.post("/getWishList_v1", async (req, res) => {
  userProgressHandler.getWishList_v1(req, res);
});

router.post("/addPurchasedByUserv1", async (req, res) => {
  userProgressHandler.addPurchasedByUser(req, res);
});

router.post("/getPurchasedByUserv1", async (req, res) => {
  userProgressHandler.getPurchasedByUser(req, res);
});
router.post("/removeFromWishlist_v1", async (req, res) => {
  userProgressHandler.removeFromWishlist_v1(req, res);
});
router.post("/removeFromCart_v1", async (req, res) => {
  userProgressHandler.removeFromCart_v1(req, res);
});

router.post("/addToDoList", async (req, res) => {
  userProgressHandler.addToDoList(req, res);
});

router.post("/getToDoList", async (req, res) => {
  userProgressHandler.getToDoList(req, res);
});

router.post("/addUpdateCoupon", async (req, res) => {
  userProgressHandler.addUpdateCoupon(req, res);
});


router.post("/applyCoupon", async (req, res) => {
  userProgressHandler.applyCoupon(req, res);
});


router.post("/changePassword", async (req, res) => {
  userProgressHandler.changePassword(req, res);
});

router.post("/createNotifications", async (req, res) => {
  userProgressHandler.createNotifications(req, res);
});

router.post("/getNotifications", async (req, res) => {
  userProgressHandler.getNotifications(req, res);
});

router.post("/markAsReadNotification", async (req, res) => {
  userProgressHandler.markAsReadNotification(req, res);
});

router.post("/markAllAsRead", async (req, res) => {
  userProgressHandler.markAllAsRead(req, res);
});

router.delete("/deleteFileFromServer", async (req, res) => {
  fileHandler.deleteFileFromServer(req, res);
});

router.post("/saveHistory", async (req, res) => {
  userProgressHandler.saveHistory(req, res);
});

router.post("/getHistory", async (req, res) => {
  userProgressHandler.getHistory(req, res);
});

router.post("/createCertificate", async (req, res) => {
  userProgressHandler.createCertificate(req, res);
});
router.post("/getCertificate", async (req, res) => {
  userProgressHandler.getCertificate(req, res);
});

router.post("/getAllCertificates", async (req, res) => {
  userProgressHandler.getAllCertificates(req, res);
});

router.post("/createChat", async (req, res) => {
  userProgressHandler.createChat(req, res);
});

router.post("/getUserChat", async (req, res) => {
  userProgressHandler.getUserChat(req, res);
});

router.post("/searchUsers", async (req, res) => {
  userProgressHandler.searchUsers(req, res);
});

router.post("/fetchChatStatus", async (req, res) => {
  userProgressHandler.fetchChatStatus(req, res);
});

router.post("/markAsReadMessage", async (req, res) => {
  userProgressHandler.markAsReadMessage(req, res);
});
router.post("/addToIFlow", async (req, res) => {
  userProgressHandler.addToIFlow(req, res);
});

router.post("/sendSessionRequest", async (req, res) => {
  sessionHandler.sendSessionRequest(req, res);
});

router.post("/getSessionRequest", async (req, res) => {
  sessionHandler.getSessionRequest(req, res);
});






// router.post("/fetchByRole",async(req,res)=>{
//   fetchUser.filterByRole(res, req)
// })

router.post("/my-server/create-paypal-order", async (req, res) => {
  try {
    const order = await createOrder(req.body);
    res.json(order);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

router.post("/my-server/capture-paypal-order", async (req, res) => {
  const { orderID } = req.body;
  try {
    const captureData = await capturePayment(orderID);
    res.json(captureData);
  } catch (err) {
    res.status(500).send(err.message);
  }
});


router.post('/meetings', meetingHandler.fetchMeetingList)
router.post('/create-meeting', meetingHandler.createMeeting)


module.exports = router;
