const express = require("express");
//const {  } = require('../controller/category');
const {
  requireSignin,
  adminMiddleware,
} = require("../common-middleware");
const {
  createProduct,
  getProductsBySlug,
  getProductDetailsById,
  deleteProductById,
  getProductsAll,
  getProducts,
  getFeatured,
  productFilter,
  getSearchProducts,
  EditProduct,
  productByCat,
  bulkEdit,
  bulkDelete,
  bulkUpload,
  bulkDownload,
  getRelatedProducts,
  handleSwitch
} = require("../controller/product");

var fileUpload = require('express-fileupload');

const router = express.Router();

router.post('/filter',productFilter)
router.get('/productbycat/:catslug',productByCat)


router.get("/downloadbulk",bulkDownload)
router.post("/getAllProducts", getProductsAll);
router.get("/getSearchProducts",getSearchProducts);
router.get("/getProducts",getProducts);
router.post("/getRealated",getRelatedProducts);
router.get("/getFeatured",getFeatured);

router.post(
  "/create",
  requireSignin,
  adminMiddleware,
  createProduct
);
router.get("/:productId", getProductDetailsById);

router.patch(
  "/edit/:productid",
  requireSignin,
  adminMiddleware,
  EditProduct
);
router.get("/details/:slug", getProductsBySlug);
//router.get('/category/getcategory', getCategories);
router.delete(
  "/delete/:productid",
  requireSignin,
  adminMiddleware,
  deleteProductById
);
router.patch('/switch/:id',requireSignin,adminMiddleware,handleSwitch)


//bulk

router.patch("/bulkedit",requireSignin,adminMiddleware,bulkEdit)
router.patch("/bulkdelete",requireSignin,adminMiddleware,bulkDelete)
router.post("/bulkupload",requireSignin,adminMiddleware,fileUpload(),bulkUpload)






module.exports = router;
