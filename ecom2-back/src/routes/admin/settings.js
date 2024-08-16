const express = require('express');
const { requireSignin, adminMiddleware } = require('../../common-middleware');
const { paymentMethod ,
    getPaymentMethods,
    getActivePaymentMethod,
    saveSliders,
    getSliders,
    saveAnalytics,
    getAnalytics,
    getTotal,
    updateSMTP,
    getSMTP,
    updateStorage,
    getStorage,
    updateLiveChat,
    getLiveChat,
    initialData
} = require('../../controller/admin/settings');
const router = express.Router();


router.post('/paymentmethod', requireSignin, adminMiddleware, paymentMethod);
router.get('/getpaymentmethods', requireSignin, adminMiddleware, getPaymentMethods);
router.get('/getactivemethod', getActivePaymentMethod);

router.post("/savesliders",requireSignin, adminMiddleware, saveSliders)
router.get("/getsliders", getSliders)

router.post('/analytics', requireSignin, adminMiddleware, saveAnalytics);
router.get('/analytics', getAnalytics);

router.get('/gettotalinfo',getTotal)

router.post("/updatesmtp",requireSignin,adminMiddleware,updateSMTP)
router.get("/smtp",requireSignin,adminMiddleware,getSMTP)

router.post("/storage",requireSignin,adminMiddleware,updateStorage)
router.get("/storage",requireSignin,adminMiddleware,getStorage)

router.post("/livechat",requireSignin,adminMiddleware,updateLiveChat)
router.get("/livechat",requireSignin,getLiveChat)


router.get('/initialdata',initialData)


module.exports = router;