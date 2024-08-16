const express = require('express');
const { requireSignin, userMiddleware } = require('../common-middleware');
const { addAddress, getAddress,updateAddress,deleteAddress } = require('../controller/address');
const router = express.Router();



router.post('/create', requireSignin, userMiddleware, addAddress);
router.get('/getaddress', requireSignin, userMiddleware, getAddress);
router.patch('/update/:addressid', requireSignin, userMiddleware, updateAddress);
router.delete('/delete/:addressid', requireSignin, userMiddleware, deleteAddress);

module.exports = router;