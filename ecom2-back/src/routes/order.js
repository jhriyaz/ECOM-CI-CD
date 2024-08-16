const { requireSignin, userMiddleware, adminMiddleware } = require("../common-middleware");
const { addOrder, getOrders,payment,paymentSuccess,getOrderByInvoice,getAllOrders,updateOrder,checkCartProducts,requestRefund } = require("../controller/order");
const router = require("express").Router();


router.post("/create", requireSignin, userMiddleware, addOrder);
router.get("/myOrders", requireSignin, userMiddleware, getOrders);
router.get('/single/:invoice', requireSignin, userMiddleware,getOrderByInvoice)

router.post("/payment",payment)
router.post("/paymentSuccess", requireSignin, userMiddleware,paymentSuccess)

router.get("/allorders",requireSignin,adminMiddleware,getAllOrders)
router.patch("/update/:invoice",requireSignin,adminMiddleware,updateOrder)

router.post("/checkCartProducts",checkCartProducts)

router.patch("/refundRequest",requireSignin, userMiddleware,requestRefund)

module.exports = router;
