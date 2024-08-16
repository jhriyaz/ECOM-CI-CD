const express = require('express');
const { requireSignin, adminMiddleware } = require('../../common-middleware');
const {seedCreate,resetData} = require('../../controller/admin/seeder');
const router = express.Router();


router.post('/create',requireSignin, adminMiddleware, seedCreate);
router.get('/reset', requireSignin, adminMiddleware, resetData);



module.exports = router;