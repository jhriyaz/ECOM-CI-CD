const express = require("express");
const {
  addCategory,
  getCategories,
  updateCategory,
  deleteCategory,
  bulkDownload
} = require("../controller/category");
const {
  requireSignin,
  adminMiddleware,
  superAdminMiddleware,
} = require("../common-middleware");
const router = express.Router();


const upload = require('../common-middleware/imageUpload')

router.post(
  "/create",
  requireSignin,
  // superAdminMiddleware,
  adminMiddleware,
  addCategory
);
router.get("/getcategory", getCategories);
router.post(
  "/update",
  requireSignin,
  // superAdminMiddleware,
  adminMiddleware,
  updateCategory
);
router.post(
  "/delete",
  requireSignin,
  // superAdminMiddleware,
  adminMiddleware,
  deleteCategory
);


router.get('/downloadbulk',bulkDownload)


module.exports = router;
