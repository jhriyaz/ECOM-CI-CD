const express = require("express");
const { requireSignin, adminMiddleware, superAdminMiddleware } = require("../../common-middleware");
const {
  getCustomers,
  updateCustomer
} = require("../../controller/admin/customers");
const router = express.Router();

router.get(`/getall`, requireSignin, adminMiddleware, getCustomers);
router.patch(`/update/:userid`, requireSignin, superAdminMiddleware, updateCustomer);

module.exports = router;
