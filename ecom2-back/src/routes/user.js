const express = require('express');
const { signup, signin,googleAuth, verify,updateProfile,updateEmail,updateImage ,changePassword,verifyOTP,resendOTP,setPassAndCreateUser, forgotPassword, resetPassword} = require('../controller/user');

const router = express.Router();
const { requireSignin, userMiddleware } = require("../common-middleware");
const upload = require('../common-middleware/imageUpload')

// #swagger.tags = ['User']
router.post('/signup', signup);
router.post('/signin', signin);
router.post("/googleauth",googleAuth)
router.post("/verify", verify);
router.post("/verifyotp", verifyOTP);
router.post("/resendotp", resendOTP);
router.patch('/setpassandcreate',setPassAndCreateUser)
router.patch('/update',requireSignin, userMiddleware,updateProfile)
router.patch('/email',requireSignin, userMiddleware,updateEmail)
router.patch('/profileimage',requireSignin, userMiddleware,upload.single("profile"),updateImage)
router.patch('/changePassword',requireSignin, userMiddleware,changePassword)


router.post("/forgotPassword", forgotPassword);
router.patch("/resetPassword", resetPassword);

// router.post('/profile', requireSignin, (req, res) => {
//     res.status(200).json({ user: 'profile' })
// });

module.exports = router;