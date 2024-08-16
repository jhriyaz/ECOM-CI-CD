const express = require('express');
const { requireSignin, adminMiddleware } = require('../../common-middleware');
const { getImages,uploadMedia ,deleteMedia} = require('../../controller/admin/media');
const router = express.Router();
const upload = require("../../common-middleware/imageUpload")

router.get(`/getall`, getImages)
router.post('/upload',upload.single("media"),uploadMedia)
router.delete('/delete/:id', requireSignin, adminMiddleware,deleteMedia)



module.exports = router;