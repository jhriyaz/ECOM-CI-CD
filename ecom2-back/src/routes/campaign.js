const { requireSignin, userMiddleware, adminMiddleware } = require("../common-middleware");
const { createCampaign,
    getCampaign,
    updateCampaign ,
    deleteCampaign,
    getProductsToSelect,
    addProductToCampaign,
    getSelectedProducts,
    updateProductToCampaign,
    removeProductFromCampaign,
    getActive,
    getProducts
} = require("../controller/campaign");
const router = require("express").Router();

router.post("/create",requireSignin,adminMiddleware, createCampaign);
router.get("/getall", getCampaign);
router.patch("/update/:campid", requireSignin,adminMiddleware,updateCampaign);
router.delete("/delete/:campid", requireSignin,adminMiddleware,deleteCampaign);
router.get("/getproductstoselect/:campaignid", requireSignin,adminMiddleware,getProductsToSelect);
router.get("/getselectedproduct/:campaignid", requireSignin,adminMiddleware,getSelectedProducts);
router.patch("/addproducttocampaign", requireSignin,adminMiddleware,addProductToCampaign);
router.patch("/updateproducttocampaign", requireSignin,adminMiddleware,updateProductToCampaign);
router.patch("/removeproductfromcampaign", requireSignin,adminMiddleware,removeProductFromCampaign);


//general

router.get('/getactive',getActive)
router.get('/products/:campslug',getProducts)



module.exports = router;