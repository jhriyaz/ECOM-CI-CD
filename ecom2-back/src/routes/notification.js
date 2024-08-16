const { requireSignin, userMiddleware, adminMiddleware } = require("../common-middleware");
const router = require("express").Router();
const {myNotifications,notificationMarkRead} = require('../controller/notification')

router.get('/mynotification',requireSignin,userMiddleware,myNotifications)
router.patch('/markread/:id',requireSignin,userMiddleware,notificationMarkRead)

module.exports = router;