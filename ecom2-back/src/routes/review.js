const express = require("express");
const {
  createReview,
  getReview,
  getSingle,
  getAllReviews,
  togglePublish,
  updateReview,
  deleteReview
} = require("../controller/review");
const { requireSignin, userMiddleware, adminMiddleware } = require("../common-middleware");
const router = express.Router();

router.post('/create',requireSignin,userMiddleware,createReview)
router.get('/get/:product',getReview)
router.get('/getsingle/:product/:order',requireSignin,userMiddleware,getSingle)
router.get('/all',requireSignin,adminMiddleware,getAllReviews)
router.put('/togglepublish/:reviewid',requireSignin,adminMiddleware,togglePublish)
router.put('/update/:reviewid',requireSignin,adminMiddleware,updateReview)
router.delete('/delete/:reviewid',requireSignin,adminMiddleware,deleteReview)

module.exports = router;
