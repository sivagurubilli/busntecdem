var express = require('express');
var router = express.Router();
const adminHandlers = require('../../handlers/admin');


//Admin - Login
router.post('/login', async (req, res) => {
    adminHandlers.adminLoginHandler(req, res);
})
router.post("/category/:type", async (req, res) => {
    adminHandlers.categoryfun(req, res)
})

router.post('/admin-fetch-menus', adminHandlers.fetchAdminMenus)
router.post('/updateMenu', adminHandlers.updateMenu)
module.exports = router;