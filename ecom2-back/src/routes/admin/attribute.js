const express = require('express');
const { create, update,deleteAttr,getAttr } = require('../../controller/admin/attribute');
const { requireSignin,adminMiddleware } = require('../../common-middleware');
const router = express.Router();


router.get('/get', getAttr);
router.post('/create',requireSignin,adminMiddleware, create);
router.patch('/update/:id',requireSignin,adminMiddleware, update);
router.delete('/delete/:id',requireSignin,adminMiddleware,deleteAttr )


module.exports = router;