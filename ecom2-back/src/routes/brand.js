const express = require('express');
const { createBrand, updateBrand,deleteBrand,getBrand,bulkEdit,bulkDelete,bulkDownload,bulkUpload} = require('../controller/brand');
const { requireSignin,adminMiddleware } = require('../common-middleware/');
const router = express.Router();
var fileUpload = require('express-fileupload');


router.get('/get',requireSignin, adminMiddleware, getBrand);
router.post('/create',requireSignin,adminMiddleware, createBrand);
router.patch('/update/:id?',requireSignin,adminMiddleware, updateBrand);
router.delete('/delete/:id?',requireSignin,adminMiddleware,deleteBrand )

//bulk
router.get('/downloadbulk',requireSignin,adminMiddleware,bulkDownload)
router.patch('/bulkedit',requireSignin,adminMiddleware,bulkEdit)
router.patch("/bulkdelete",requireSignin,adminMiddleware,bulkDelete)
router.post("/bulkupload",requireSignin,adminMiddleware,fileUpload(),bulkUpload)



module.exports = router;