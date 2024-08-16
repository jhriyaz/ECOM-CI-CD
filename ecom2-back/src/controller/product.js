const Product = require("../models/product");
const Campaign = require("../models/campaign");
const shortId = require("shortid");
const slugify = require("slugify");
const Category = require("../models/category");
const Brand = require("../models/brand");
const productValidator = require('../validators/productValidator')
const async = require('async')
const moment = require('moment')
const csv = require('csvtojson');
const mongoose = require("mongoose");




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


//-------------------------------------------------------------------------------------------------------------------------------------
exports.createProduct = (req, res) => {
  // #swagger.tags = ['Product']
  // #swagger.summary = 'Create product'

  const {
    name,
    categories,
    brand,
    unit,
    tags,
    thumbnail,
    gallery,
    attributes,
    variations,
    productType,
    price,
    discount,
    tax,
    sku,
    stock,
    description,
    shipping,
    meta,
  } = req.body;



  const productValidate = productValidator(name, unit, thumbnail, price)

  if (!productValidate.isError) {
    return res.status(404).json(error)
  }

  if (categories.length < 1 || typeof(categories) !== 'object') {
    return res.status(400).json({ category: "please select a category with level" })
  }



  const product = new Product({
    name: name,
    slug: slugify(name) + "-" + shortId.generate(),
    categories,
    brand: brand || null,
    tags,
    thumbnail,
    gallery,
    attributes: attributes || [],
    variations: variations || [],
    productType,
    price,
    discount,
    tax,
    sku,
    stock,
    description,
    description,
    shipping,
    meta,
    unit,
    createdBy: req.user._id,
  });


  product.save((error, product) => {
    //console.log(error);
    if (error) return res.status(400).json({ error });
    if (product) {
      res.status(201).json({ success: true, product });
    }
  });
};


//-------------------------------------------------------------------------------------------------------------------------------------
exports.EditProduct = (req, res) => {
  // #swagger.tags = ['Product']
  // #swagger.summary = 'Edit product'


  const productId = req.params.productid


  const {
    name,
    categories,
    brand,
    unit,
    tags,
    thumbnail,
    gallery,
    attributes,
    variations,
    productType,
    price,
    discount,
    tax,
    sku,
    stock,
    description,
    shipping,
    meta,
  } = req.body;

  const productValidate = productValidator(name, unit, thumbnail, price)

  console.log('log');

  if (!productValidate.isError) {
    return res.status(404).json(error)
  }

  console.log('categories', categories);

  if (categories.length < 1 || typeof(categories) !== 'object') {
    return res.status(400).json({ category: "please select a category with level." })
  }


  const data = {
    name,
    categories,
    unit,
    price,
    thumbnail,
    tags: tags || [],
    gallery: gallery || [],
    attributes: attributes || [],
    variations: variations || [],
    productType,
    discount,
    tax,
    sku,
    stock,
    description: description || '',
    shipping,
    meta

  }

  if (brand) {
    data.brand = brand
  }


  if(mongoose.isValidObjectId(productId)) {
       
    Product.findByIdAndUpdate(productId, { $set: data }, { new: true })
    .then(product => {
      return res.status(200).json({ success: true, product });
    })
    .catch(err => {
      console.log(err, 'err');
      if (err.name === "MongoError" && err.code === 11000) {
        //console.log(err.keyPattern);
        Object.keys(err.keyPattern).map(key => {
          console.log(key, 'key');
          key === 'sku' && res.status(400).json({ sku: "Sku already exists" })
        })

      }
    })
  }else {
    return res.status(400).json({ sku: "ID id not valid" })
  }

};


//----------------------------------------------------------------------------------------------------------------------------------
exports.getProductsBySlug = async (req, res) => {
  // #swagger.tags = ['Product']
  // #swagger.summary = 'Get product by slug'
  const { slug } = req.params;
  const { campaign } = req.query;

  let camp = null

  if (campaign && campaign !== 'undefined') {
    let opt = {
      _id: campaign,
      isActive: true,
      startAt: { "$lte": moment(Date.now()) },
      endAt: { "$gte": moment(Date.now()) }
    }

    try {
      camp = await Campaign.findOne(opt).exec()
    } catch (error) {
      console.log("error");
    }

  }


  // Product.findOne({ slug })
  //   .populate({ path: "brand", select: "_id name image slug" })
  //   .then(product => {
  //     let campDiscount = null
  //     if (camp) {
  //       let campArray = product.campaigns ? [...product.campaigns] : []
  //       let campselected = campArray.filter(c => c.campaign.toString() == camp._id.toString())[0]
  //       campDiscount = { ...campselected.discount, campName: camp.name, campSlug: camp.slug, campId: camp._id }
  //     }
  //     res.status(200).json({ success: true, product, campDiscount })
  //   })
  //   .catch(err => {
  //     console.log(err);
  //   })


  Product.aggregate([
    { $match: { slug } },
    { $limit: 10 },
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
      $lookup:
      {
        from: "brands",
        localField: "brand",
        foreignField: "_id",
        as: "brand"
      }
    },
    {
      $addFields: {
        ratingCount: { $size: "$rating" },
        average: { $avg: "$rating.rating" }
      }
    },
    { $project: { rating: 0 } },
  ]).exec((error, products) => {
    //console.log(products);
    let product = products[0]
    let campDiscount = null
    if (camp) {
      let campArray = product.campaigns ? [...product.campaigns] : []
      let campselected = campArray.filter(c => c.campaign.toString() == camp._id.toString())[0]
      campDiscount = { ...campselected.discount, campName: camp.name, campSlug: camp.slug, campId: camp._id }
    }
    res.status(200).json({ success: true, product, campDiscount })
    // res.status(200).json({ success: true, products:result });
    console.log(error);
  })


};
//-------------------------------------------------------------------------------------------------------------------------------------
exports.getProductDetailsById = (req, res) => {
  // #swagger.tags = ['Product']
  // #swagger.summary = 'Get product by id'
  const { productId } = req.params;
  if (productId) {
    Product.findOne({ _id: productId }).exec((error, product) => {
      if (error) return res.status(400).json({ error });
      if (product) {
        res.status(200).json({ product });
      }
    });
  } else {
    return res.status(400).json({ error: "Params required" });
  }
};
//----------------------------------------------------------------------------------------------------------------------------------
// new update
exports.deleteProductById = (req, res) => {
  // #swagger.tags = ['Product']
  // #swagger.summary = 'Delete product'
  const productId = req.params.productid;
  if (productId) {
    Product.deleteOne({ _id: productId }).exec((error, result) => {
      if (error) return res.status(400).json({ error });
      if (result) {
        //console.log(result);
        res.status(202).json({ success: true });
      }
    });
  } else {
    res.status(400).json({ error: "Params required" });
  }
};
//----------------------------------------------------------------------------------------------------------------------------------
exports.getProductsAll = async (req, res) => {
  // #swagger.tags = ['Product']
  // #swagger.summary = 'Get all with pagination'
  const { page, limit, sort_by, isFeatured, isActive, type, query } = req.body
  // console.log('bool', typeof(isFeatured), typeof(isActive) );
  // console.log('val', isFeatured, isActive);

  // if(isFeatured !== (true || false)) {
  //   return res.status(400).json({ msg: 'Please provide featured' })
  // }
  // if(isActive !== (true || false)) {
  //   return res.status(400).json({ msg: 'Please provide active' })
  // }

  let pageOptions = {
    page: 0,
    limit: 50
  }

  let options = {}


  let sort = { "createdAt": -1 }

  if (page) {
    pageOptions["page"] = parseInt(page == 0 ? 0 : page - 1, 10) || 0
  }
  if (limit) {
    pageOptions["limit"] = parseInt(limit, 10) || 0
  }

  if (isFeatured) {
    options.isFeatured = isFeatured
  }
  if (isActive) {
    options.isActive = isActive
  }

  if (type === 'category') {
    let cat = await Category.findOne({ name: query }).exec()
    if (!cat) {
      return res.status(200).json({ success: true, products: [], count: 0 });
    }
    options[`categories.category`] = cat._id
    //console.log(cat);
  }
  if (type === 'brand') {
    let brandId = await Brand.findOne({ name: query }).exec()
    if (!brandId) {
      return res.status(200).json({ success: true, products: [], count: 0 });
    }
    options[`brand`] = brandId._id
    //console.log(cat);
  }


  if (type === 'product') {
    // options.name =new RegExp(query, "i")
    options.name = { $regex: query, $options: "xi" }

  }


  Product.find(options)
    .sort(sort)
    .skip(pageOptions.page * pageOptions.limit)
    .limit(pageOptions.limit)
    .populate({ path: "brand", select: "_id name" })
    .then(async products => {
      let count = await Product.countDocuments(options).exec()
      res.status(200).json({ success: true, products, count });
    })
    .catch(err => {
      console.log(err);
    })




};
//---------------------------------------------------------------------------------------------------------------------------------
exports.getProducts = async (req, res) => {
  // #swagger.tags = ['Product']
  // #swagger.summary = ''
  Product.aggregate([
    { $project: { slug: 1, thumbnail: 1, price: 1, discount: 1, name: 1, createdAt: 1 } },
    { $limit: 15 },
    { $sort: { "createdAt": -1 } },
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
  ]).exec((error, result) => {
    res.status(200).json({ success: true, products: result });
    console.log(error);
  })



};


//---------------------------------------------------------------------------------------------------------------------------------
exports.getRelatedProducts = async (req, res) => {
  // #swagger.tags = ['Product']
  // #swagger.summary = 'Get related products'
  const { tags, _id, category } = req.body
  // console.log(tags, _id ,category);
  let options = {}
  // if(tags && tags.length>0){
  //   options["tags"] = { $in: tags }
  // }

  if (category) {
    options["categories.category"] = mongoose.Types.ObjectId(category)
  }

  Product.aggregate([
    {
      $match: {
        "_id": { $ne: mongoose.isValidObjectId(_id) ? mongoose.Types.ObjectId(_id) : undefined },
        "$or": [options]
      }
    },
    { $project: { slug: 1, thumbnail: 1, price: 1, discount: 1, name: 1, createdAt: 1 } },
    { $limit: 15 },
    { $sort: { "createdAt": -1 } },
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
  ]).exec((error, result) => {
    res.status(200).json({ success: true, products: result });
    // console.log(error);
  })


};


//---------------------------------------------------------------------------------------------------------------------------------

exports.getFeatured = (req, res) => {
  // #swagger.tags = ['Product']
  // #swagger.summary = 'Get featured products'
  Product.aggregate([
    { $match: { isFeatured: true } },
    { $project: { slug: 1, thumbnail: 1, price: 1, discount: 1, name: 1 } },
    { $limit: 10 },
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
  ]).exec((error, result) => {
    res.status(200).json({ success: true, products: result });
    console.log(error);
  })
}

//----------------------------------------------------------------------------------------------------------------------------------

function getUniqueVar(vars) {
  let uvar = {}
  vars.map(v => {
    //console.log(uvar[v.name]);
    if (uvar[v.name]) {
      uvar[v.name] = [...uvar[v.name], v.values]
    } else {
      uvar[v.name] = [v.values]
    }

  })

  return uvar
}



exports.productFilter = async (req, res) => {
  // #swagger.tags = ['Product']
  // #swagger.summary = 'Filter products'

  const { category, brand, min, max, query, page, limit, sort_by } = req.body
  console.log( req.body);
  let options = {}


  const pageOptions = {
    page: 0,
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


  if (page) {
    pageOptions["page"] = parseInt(page == 0 ? 0 : page - 1, 10) || 0
  }
  if (limit) {
    pageOptions["limit"] = parseInt(limit, 10) || 0
  }



  if (category) {
    let cat = await Category.findOne({ slug: category }).exec()
    options[`categories.category`] = cat._id
    //console.log(cat);
  }
  if (brand) {
    let brandid = await Brand.findOne({ slug: brand }).exec()
    options[`brand`] = brandid._id
    //console.log(cat);
  }

  if (min && max) {
    if (max > 0) {
      options['price'] = { '$gte': parseInt(min), '$lte': parseInt(max) }
    }
  }

  if (query) {
    // options.name =new RegExp(query, "i")
    options.name = { $regex: query, $options: "xi" }

  }

  Object.keys(req.body).map(key => {
    // console.log(key);
    if (key == 'brand' || key == 'min' || key == 'max' || key == 'category' || key == 'query' || key == 'page' || key == 'limit' || key == 'sort_by') return

    options["attributes.name"] = { $all: [key] }
    options["attributes.values"] = { $all: [req.body[key]] }
    //options["attributes.values"] =req.body[key] 
    // options['attributes'] ={"name":key} 


  })



  let allBrandIds = []
  if (query) {
    let brandIds = await Brand.aggregate([
      { $match: { name: { $regex: query, $options: "i" } } },
      { $group: { _id: null, ids: { $push: "$_id" } } }
    ])
    if (brandIds.length) {
      allBrandIds = brandIds[0].ids
    }
  }




  Product.aggregate([
    { $match: { $or: [options, { brand: { $in: allBrandIds } }] } },
    {
      $set: {
        categories: {
          $filter: {
            input: "$categories",
            cond: { $eq: ["$$this.level", { $max: "$categories.level" }] }
          }
        }
      }
    },
    { $set: { categories: { $arrayElemAt: ["$categories", 0] } } },
    { $project: { a: '$brand', b: "$categories", c: "$attributes" } },
    { $unwind: '$a' },
    { $unwind: '$b' },
    {
      $unwind: {
        "path": "$c",
        "preserveNullAndEmptyArrays": true
      }
    },
    {
      $unwind: {
        "path": "$c.values",
        "preserveNullAndEmptyArrays": true
      }
    },
    { $group: { _id: 'a', brand: { $addToSet: '$a' }, cat: { $addToSet: "$b" }, var: { $addToSet: "$c" } } },


  ]).exec(async (err, allresults) => {
    //console.log(allresults[0].brand);
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
        let ids = []
        allresults[0].cat.map(c => {
          ids.push(c.category)
        })

        cats = await Category.find({ _id: { $in: ids } }).exec()
        return cats

      },
      products: async function () {

        return { errro, products } = await Product.aggregate([
          { $match: { $or: [options, { brand: { $in: allBrandIds } }] } },
          { $project: { slug: 1, thumbnail: 1, price: 1, discount: 1, name: 1, createdAt: 1, brand: 1 } },
          { $sort: sort },
          { $skip: pageOptions.page * pageOptions.limit },
          { $limit: pageOptions.limit },
          // { $lookup: {from: 'brands', localField: 'brand', foreignField: '_id', as: 'brand'} },
          // { $match: { "brand.name": {$regex: '.*'+ "one plus" +'.*', $options: 'si'}}},
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
        let count = Product.countDocuments({ $or: [options, { brand: { $in: allBrandIds } }] })
          .exec()
        //console.log(products);
        return count
      }
    }, function (err, results) {
      //console.log( results);
      // results is now equals to: {one: 1, two: 2}
      if (err) throw err;
      //console.log(allresults[0]?.var);
      res.status(200).json({
        brands: results.brands,
        categories: results.categories,
        variations: getUniqueVar(allresults[0]?.var || []),
        products: results.products,
        count: results.count
      });
    });

  })


}

//---------------------------------------------------------------------------------------------------------------------------------
exports.getSearchProducts = async (req, res) => {
  // #swagger.tags = ['Product']
  // #swagger.summary = 'Search products'
  let options = {}
  const query = req.query.search




  if (query) {
    options.name = { $regex: query, $options: "xi" }
  }

  let allBrandIds = []
  if (query) {
    let brandIds = await Brand.aggregate([
      { $match: { name: { $regex: query, $options: "i" } } },
      { $group: { _id: null, ids: { $push: "$_id" } } }
    ])
    if (brandIds.length) {
      allBrandIds = brandIds[0].ids
    }
  }

  let products = await Product.find({ $or: [options, { brand: { $in: allBrandIds } }] })
    .select("name slug thumbnail price discount")
    .limit(15)
    .exec()
  //console.log(products);
  res.status(200).json({ success: true, products })

}


//---------------------------------------------------------------------------------------------------------------------------------
exports.productByCat = async (req, res) => {
  // #swagger.tags = ['Product']
  // #swagger.summary = 'Product by category'
  const catslug = req.params.catslug
  let options = {}

  if (catslug) {
    let cat = await Category.findOne({ slug: catslug }).exec()
    if (cat) {
      options["categories.category"] = cat._id
    } else {
      return res.status(400).json({ error: "category not found" })
    }
  }

  Product.aggregate([
    { $match: options },
    { $project: { slug: 1, thumbnail: 1, price: 1, discount: 1, name: 1 } },
    { $limit: 15 },
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
  ]).exec((error, result) => {
    res.status(200).json({ success: true, products: result });
    console.log(error);
  })

}


//------------------------------------------------------------------------------------------------------------------------------
exports.bulkEdit = async (req, res) => {
  // #swagger.tags = ['Product']
  // #swagger.summary = 'Product bulk edit'
  let { ids, isActive, isFeatured } = req.body
  if (ids.length === 0) {
    return res.status(200).json({ success: true, products: [] })
  }

  let data = {}
  if (isActive !== undefined) {
    data["isActive"] = isActive
  }
  if (isFeatured !== undefined) {
    data["isFeatured"] = isFeatured
  }

  Product.updateMany({ _id: ids }, { $set: data }, { new: true })
    .select("-attributes -variations")
    .then(updated => {

      Product.find({ _id: { $in: ids } })
        .then(products => {

          res.status(200).json({ success: true, products })
        })

    })
    .catch(err => {
      console.log(err);
    })


}

//----------------------------------------------------------------------------------------------------------------------------------
exports.bulkDelete = (req, res) => {
    // #swagger.tags = ['Product']
  // #swagger.summary = 'Product Bulk Delete'
  let { ids } = req.body
  if (ids.length === 0) {
    return res.status(200).json({ success: true, products: [] })
  }

  Product.deleteMany({ _id: ids })
    .then(deleted => {
      res.status(200).json({ success: true })
    })
    .catch(err => {
      console.log(err);
    })
}

//--------------------------------------------------------------------------------------------------------------------------------


const findCatList = async (categories, catId) => {
  if (catId === 'category *') return []
  let array = []
  let selected = categories.filter(cat => cat._id == catId)[0]
  if (!selected) return []

  array.unshift({ category: selected._id, level: 1 })

  if (selected.parentId) {
    let index = array.findIndex(cat => cat.level === 1)
    array[index] = { ...array[index], level: 2 }

    let selectedParent = categories.filter(cat => cat._id == selected.parentId)[0]
    array.unshift({ category: selectedParent._id, level: 1 })


    if (selectedParent.parentId) {


      let index2 = array.findIndex(cat => cat.level === 2)
      array[index2] = { ...array[index2], level: 3 }

      let index1 = array.findIndex(cat => cat.level === 1)
      array[index1] = { ...array[index1], level: 2 }

      let selectedMain = categories.filter(cat => cat._id == selectedParent.parentId)[0]
      array.unshift({ category: selectedMain._id, level: 1 })
    }
  }


  return array
}


const findCreateCategory = async (categoryName, userId, parentId) => {
  //console.log(categoryName);
  let id = ''
  let cat = await Category.findOne({ name: categoryName }).exec()
  if (cat) {
    id = cat._id
  } else {
    let data = { name: categoryName, slug: slugify(categoryName) + "-" + shortId.generate(), createdBy: userId }
    if (parentId) {
      data.parentId = parentId
    }
    let _cat = new Category(data)
    let cat = await _cat.save()
    id = cat._id
  }

  return id
}


const createOrAddBrand = async (brandName) => {
  let brandId = ""
  if (!brandName) return brandId
  if (brandName === "brand *") return brandId
  try {
    let brand = await Brand.findOne({ name: brandName }).exec()

    if (brand) {
      brandId = brand._id
    } else {
      let _brand = new Brand({ name: brandName, slug: slugify(brandName + "-" + shortId.generate()) })
      let brand = await _brand.save()
      brandId = brand._id
    }
  } catch (error) {
    console.log(error);
  }
  return brandId
}

exports.bulkUpload = async (req, res) => {
    // #swagger.tags = ['Product']
  // #swagger.summary = 'Product bulk upload'
  if (!req.files)
    return res.status(400).send('No files were uploaded.');
  //console.log(req.files)
  var productFile = req.files.file;

  //let categories = await Category.find()
  // console.log(categories);

  let csvData = [];

  let onError = (err) => {
    console.log(err);
  }
  let onComplete = () => {
    //console.log(JSON.stringify(csvData));
    Product.create(csvData, function (err, documents) {
      console.log(err);
      if (err) return res.status(400).json({ error: "invalid product csv file" });
      res.status(200).json({
        success: true,
        count: documents?.length
      })
    });
  }



  csv()
    .fromString(productFile.data.toString())
    .subscribe((data) => {

      return new Promise(async (resolve, reject) => {
        let item = {
          _id: new mongoose.Types.ObjectId(),
          name: data['name *'],
          slug: slugify(data['name *']) + "-" + shortId.generate(),
          thumbnail: data['thumbnail *'],
          gallery: data['gallery'].split(','),
          categories: [],
          price: data['Price *'] || 0,
          discount: { discountType: data['discount_type_(flat/percent)'] !== "flat" || data['discount_type_(flat/percent)'] !== 'percent' ? "flat" : data['discount_type_(flat/percent)'], value: data['discount_value'] || 0 },
          tax: { taxType: data['tax_type (flat/percent)'] !== "flat" || data['tax_type (flat/percent)'] !== 'percent' ? "flat" : data['tax_type (flat/percent)'], value: data['tax_value'] || 0 },
          unit: data['unit *'],
          sku: data['sku *'] || "",
          stock: data['stock *'] || "100",
          description: data['description'] || "",
          shipping: { isFree: parseInt(data['shipping_fee']) > 0 ? false : true, cost: data['shipping_fee'] },
          tags: data['tags'],
          meta: {
            title: data['meta_title'] || "",
            description: data['meta_description'] || "",
            image: data['meta_image'] || "",
          },
          createdBy: req.user._id
        }

        let categoriesData = data['category *'].split("/")

        let brandId = await createOrAddBrand(data['brand']?.trim().toLowerCase())

        if (brandId) {
          item.brand = brandId
        }

        if (categoriesData.length > 1) {
          let cats = []
          if (categoriesData[0]?.trim()) {
            //console.log({categoriesData});
            let cat1 = await findCreateCategory(categoriesData[0].trim().toLowerCase(), req.user._id)
            cats.push({ level: 1, category: cat1 })
            if (Boolean(cat1)) {
              if (categoriesData[1]?.trim()) {
                let cat2 = await findCreateCategory(categoriesData[1].trim().toLowerCase(), req.user._id, cat1)
                cats.push({ level: 2, category: cat2 })
                if (Boolean(cat2)) {
                  if (categoriesData[2]?.trim()) {
                    cats.push({ level: 3, category: await findCreateCategory(categoriesData[2].trim().toLowerCase(), req.user._id, cat2) })
                  }
                }

              }
            }
          }
          item.categories = cats
        } else if (categoriesData.length === 1 && Boolean(categoriesData[0])) {

          let cat = await findCreateCategory(categoriesData[0].trim().toLowerCase(), req.user._id)
          if (cat) {
            item.categories = [{ level: 1, category: cat }]
          }
        }
        csvData.push(item);
        resolve()
        // long operation for each json e.g. transform / write into database.
      })
    }, onError, onComplete);
}

//shipping: { isFree: parseInt(data[14]) > 0 ? false : true, cost: data[14] },
//------------------------------------------------------------------------------------------------------------------------------
exports.bulkDownload = (req, res) => {
  // #swagger.tags = ['Product']
  // #swagger.summary = 'Product bulk download'
  Product.aggregate([

    {
      $set: {
        categories: {
          $filter: {
            input: "$categories",
            cond: { $eq: ["$$this.level", { $max: "$categories.level" }] }
          }
        }
      }
    },
    { $set: { categories: { $arrayElemAt: ["$categories", 0] } } },
    { $project: { "variations": 0, "attributes": 0, "campaigns": 0 } },
  ])
    .exec(async (err, products) => {
      res.status(200).json({ success: true, products })
    })

}

//---------------------------------------------------------------------------------------------------------------------------------

exports.handleSwitch = (req, res) => {
    // #swagger.tags = ['Product']
  // #swagger.summary = 'Change active and featured'
  let id = req.params.id
  let { isActive, isFeatured } = req.body
  let options = {}
  if (isActive !== undefined) {
    options.isActive = isActive
  }
  if (isFeatured !== undefined) {
    options.isFeatured = isFeatured
  }



  Product.findByIdAndUpdate(id, { $set: options }, { new: true })
    .populate('brand', "name")
    .then(product => {
      res.status(200).json({ success: true, product })
    })
    .catch(err => {
      console.log(err);
      res.status(400).json({ error: "Something went wrong" })
    })
}