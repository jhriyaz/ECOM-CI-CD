const Campaign = require("../models/campaign");
const Brand = require("../models/brand");
const Category = require("../models/category");
const Product = require("../models/product");
const slugify = require('slugify')
const shortId = require('shortid')
const campaignValidator = require('../validators/campaignValidator')
const moment = require('moment')
const async = require('async')
const mongoose = require('mongoose');

function createCategories(categories, parentId = null) {
  const categoryList = [];
  let category;
  if (parentId == null) {
    category = categories.filter((cat) => cat.parentId == undefined);
  } else {
    category = categories.filter((cat) => cat.parentId == parentId);
  }

  for (let cate of category) {
    categoryList.push({
      _id: cate._id,
      name: cate.name,
      slug: cate.slug,
      parentId: cate.parentId,
      order: cate.order,
      categoryImage: cate.categoryImage,
      children: createCategories(categories, cate._id),
    });
  }

  return categoryList;
}




exports.createCampaign = (req, res) => {
  // #swagger.tags = ['Campaign']
  // #swagger.summary = 'Create campaign'
  let { name, description, image, startAt, endAt, isActive } = req.body

  const campaignValidate = campaignValidator(name, startAt, endAt)

  if (!campaignValidate.isError) {
    return res.status(404).json(error)
  }


  let _campaign = new Campaign({
    name,
    slug: slugify(name) + "-" + shortId.generate(),
    description: description || '',
    image: image || '',
    startAt,
    endAt

  })
  _campaign.save()
    .then(campaign => {
      //console.log(campaign);
      res.status(201).json({ success: true, campaign })
    })
    .catch(err => {
      res.status(400).json({ error: "something went wrong" })
    })




}


exports.getCampaign = (req, res) => {
  // #swagger.tags = ['Campaign']
  // #swagger.summary = 'Get all campaign'
  Campaign.find()
    .then(campaigns => {
      //console.log(campaign);
      res.status(201).json({ success: true, campaigns })
    })
    .catch(err => {
      res.status(400).json({ error: "something went wrong" })
    })
}


exports.updateCampaign = (req, res) => {
  // #swagger.tags = ['Campaign']
  // #swagger.summary = 'Update campaign'
  let { name, description, image, startAt, endAt, isActive } = req.body

  const campaignValidate = campaignValidator(name, startAt, endAt)

  if (!campaignValidate.isError) {
    return res.status(404).json(error)
  }

  let campId = req.params.campid


  Campaign.findByIdAndUpdate(campId, { $set: { name, slug: slugify(name) + "-" + shortId.generate(), image, description, startAt, endAt, isActive: isActive || true } }, { new: true })
    .then(campaign => {
      //console.log(campaign);
      res.status(200).json({ success: true, campaign })
    })
    .catch(err => {
      res.status(400).json({ error: "something went wrong" })
    })
}



exports.deleteCampaign = (req, res) => {
  // #swagger.tags = ['Campaign']
  // #swagger.summary = 'Delete campaign'
  let campId = req.params.campid

  Campaign.findByIdAndDelete(campId)
    .then(campaign => {
      //console.log(campaign);
      res.status(200).json({ success: true })
    })
    .catch(err => {
      res.status(400).json({ error: "something went wrong" })
    })
}

exports.getProductsToSelect = (req, res) => {
  // #swagger.tags = ['Campaign']
  // #swagger.summary = 'Get products to select'
  let campaignId = req.params.campaignid
  console.log(campaignId);
  Product.find({ "campaigns.campaign": { $ne: campaignId } })
    .select("_id price discount thumbnail name campaigns")
    .then(products => {
      res.status(200).json({ success: true, products })
    })
    .catch(err => {
      res.status(400).json({ error: "something went wrong" })
    })
}


exports.getSelectedProducts = (req, res) => {
  // #swagger.tags = ['Campaign']
  // #swagger.summary = 'Get selected products'
  let campaignId = req.params.campaignid

  Product.find({ "campaigns.campaign": campaignId })
    .select("_id price discount thumbnail name campaigns")
    .then(products => {
      res.status(200).json({ success: true, products })
    })
    .catch(err => {
      res.status(400).json({ error: "something went wrong" })
    })
}


exports.addProductToCampaign = (req, res) => {
  // #swagger.tags = ['Campaign']
  // #swagger.summary = 'Add product to campaign'
  let { campaignId, productId, value, discountType } = req.body
  let data = {
    campaign: campaignId,
    discount: {
      value: value || 0,
      discountType: discountType || "flat"
    }
  }

  Product.findById(productId)
    .select("_id price discount thumbnail name campaigns")
    .then(product => {
      let campaigns = product.campaigns ? [...product.campaigns] : []
      let index = campaigns.findIndex(camp => camp.campaign == campaignId)
      if (index === -1) {
        Product.findByIdAndUpdate(productId, { $push: { "campaigns": data } }, { new: true })
          .select("_id price discount thumbnail name campaigns")
          .then(productup => {

            res.status(200).json({ success: true, product: productup })
          })
          .catch(err => {
            res.status(400).json({ error: "something went wrong" })
          })
      }
      else {

        return res.status(200).json({ success: true, product })
      }
    })


}


exports.updateProductToCampaign = (req, res) => {
  // #swagger.tags = ['Campaign']
  // #swagger.summary = 'Update product in campaign'
  let { campaignId, productId, value, discountType } = req.body
  let data = {
    campaign: campaignId,
    discount: {
      value: value || 0,
      discountType: discountType || "flat"
    }
  }


  Product.findById(productId)
    .select("_id price discount thumbnail name campaigns")
    .then(product => {
      let campaigns = product.campaigns ? [...product.campaigns] : []
      let index = campaigns.findIndex(camp => camp.campaign == campaignId)
      if (index !== -1) {
        campaigns[index] = data
        Product.findByIdAndUpdate(productId, { $set: { "campaigns": campaigns } }, { new: true })
          .select("_id price discount thumbnail name campaigns")
          .then(productup => {

            res.status(200).json({ success: true, product: productup })
          })
          .catch(err => {
            res.status(400).json({ error: "something went wrong" })
          })
      }
      else {

        return res.status(200).json({ success: true, product })
      }
    })
}

exports.removeProductFromCampaign = (req, res) => {
  // #swagger.tags = ['Campaign']
  // #swagger.summary = 'Remove product from campaign'
  let { campaignId, productId } = req.body
  Product.findById(productId)
    .select("_id price discount thumbnail name campaigns")
    .then(product => {
      let campaigns = product.campaigns ? [...product.campaigns] : []
      let index = campaigns.findIndex(camp => camp.campaign == campaignId)
      if (index !== -1) {
        campaigns.splice(index, 1)
        Product.findByIdAndUpdate(productId, { $set: { "campaigns": campaigns } }, { new: true })
          .select("_id price discount thumbnail name campaigns")
          .then(productup => {

            res.status(200).json({ success: true, product: productup })
          })
          .catch(err => {
            res.status(400).json({ error: "something went wrong" })
          })
      }

    })
}



exports.getActive = (req, res) => {
  // #swagger.tags = ['Campaign']
  // #swagger.summary = 'Get active campaign'
  let opt = {
    isActive: true,
    startAt: { "$lte": moment(Date.now()) },
    endAt: { "$gte": moment(Date.now()) }
  }
  Campaign.find(opt)
    .then(campaigns => {
      res.status(200).json({ success: true, campaigns })
    })
    .catch(err => {
      res.status(400).json({ error: "something went wrong" })
    })

}


exports.getProducts = (req, res) => {
  // #swagger.tags = ['Campaign']
  // #swagger.summary = 'Get products from a campaign'
  let campSlug = req.params.campslug
  let { category, brand, page, sort_by } = req.query

  const pageOptions = {
    page: parseInt(page, 10) || 0,
    limit: 24
  }
  let sort = { "createdAt": 1 }

  if (sort_by == 'newest') {
    sort = { "createdAt": 1 }
  }
  if (sort_by == 'oldest') {
    sort = { "createdAt": -1 }
  }
  if (sort_by == 'price-asc') {
    sort = { "price": 1 }
  }
  if (sort_by == 'price-desc') {
    sort = { "price": -1 }
  }

  //console.log(category,brand);

  let productOpt = {}
  if (category) {
    productOpt[`categories.category`] = mongoose.Types.ObjectId(category)
  }
  if (brand) {
    productOpt[`brand`] = mongoose.Types.ObjectId(brand)
  }

  //console.log(productOpt);



  let opt = {
    slug: campSlug,
    isActive: true,
    startAt: { "$lte": moment(Date.now()) },
    endAt: { "$gte": moment(Date.now()) }
  }
  Campaign.findOne(opt)
    .then(campaign => {
      if (!campaign) {
        return res.status(400).json({ error: "campaign not found" })
      }


      Product.aggregate([
        { $match: { "campaigns.campaign": campaign._id, ...productOpt } },

        { $project: { a: '$brand', b: "$categories.category" } },
        { $unwind: '$a' },
        { $unwind: '$b' },
        { $group: { _id: 'a', brand: { $addToSet: '$a' }, cat: { $addToSet: "$b" } } },

      ]).exec(async (err, allresults) => {
        //console.log(allresults,err);
        if (err) throw err;
        async.parallel({
          brands: async function () {
            let brands = []
            if (!allresults[0]?.brand) return brands
            brands = await Brand.find({ _id: { $in: allresults[0].brand } }).exec()
            return brands

          },
          categories: async function () {
            let cats = []
            if (!allresults[0]?.cat) return cats
            cats = await Category.find({ _id: { $in: allresults[0].cat } }).exec()
            return cats

          },
          products: async function () {
            return { errro, products } = await Product.aggregate([
              { $match: { "campaigns.campaign": mongoose.Types.ObjectId(campaign._id), ...productOpt } },
              { $project: { slug: 1, thumbnail: 1, price: 1, discount: 1, name: 1, createdAt: 1, campaigns: 1 } },
              { $sort: sort },
              { $skip: pageOptions.page * pageOptions.limit },
              { $limit: pageOptions.limit },
              {
                $lookup:
                {
                  from: "reviews",
                  let: { id: '$_id' },
                  pipeline: [
                    {
                      "$match": {
                        "$expr": {
                          "$and": [
                            { "$eq": ["$product", '$$id'] },
                            { "$eq": ["$isPublished", true] },
                          ]
                        }
                      }
                    },
                  ],
                  as: "rating"
                }
              },
              {
                $addFields: {
                  ratingCount: { $size: "$rating" },
                  average: { $avg: "$rating.rating" }
                }
              },
              { $project: { rating: 0 } },
            ]).exec()
          },
          count: async function () {
            let count = Product.countDocuments({ "campaigns.campaign": campaign._id, ...productOpt })
              .exec()
            //console.log(products);
            return count
          }
        }, function (err, results) {
          //console.log(results);
          if (err) throw err;
          res.status(200).json({
            success: true,
            products: results.products,
            campaign,
            brands: results.brands,
            categories: createCategories(results.categories),
            count: results.count,
          })
          // res.status(200).json({ 
          //   brands: results.brands, 
          //   categories: createCategories(results.categories), 
          //   variations: getUniqueVar(allresults[0]?.var||[]) ,
          //   products:results.products
          // });
        });
        //  let brands = await Brand.find({_id:{$in:results[0].brand}}).exec()
        //  let cats = await Category.find({_id:{$in:results[0].cat}}).exec()

      })

    })
    .catch(err => {
      res.status(400).json({ error: "something went wrong" })
    })
}