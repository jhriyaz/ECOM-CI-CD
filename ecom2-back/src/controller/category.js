const Category = require("../models/category");
const slugify = require("slugify");
const shortid = require("shortid");

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
      categoryImage:cate.categoryImage,
      children: createCategories(categories, cate._id),
    });
  }

  return categoryList;
}



exports.addCategory = (req, res) => {
  // #swagger.tags = ['Category']
  // #swagger.summary = 'Create category'
  if(!req.body.name){
    return res.status(400).json({error:"Enter category name"})
  }
  const categoryObj = {
    name: req.body.name,
    slug: `${slugify(req.body.name)}-${shortid.generate()}`,
    createdBy: req.user._id,
    order:req.body.order||0
  };

  

  if (req.body.categoryImage) {
    categoryObj.categoryImage = req.body.categoryImage;
  }

  if (req.body.parentId) {
    categoryObj.parentId = req.body.parentId;
  }

  const cat = new Category(categoryObj);
  cat.save((error, category) => {
    if (error) return res.status(400).json({ error });
    if (category) {
      return res.status(201).json({ category ,success:true });
    }
  });
};

exports.getCategories = (req, res) => {
  // #swagger.tags = ['Category']
  // #swagger.summary = 'Get categories'
  Category.find({}).exec((error, categories) => {
    if (error) return res.status(400).json({ error });
    if (categories) {
      const categoryList = createCategories(categories);

      //console.log( 'test1', chindrenFinder.findObjectByCategoryName(categoryList, 'mobile') );
      // const myfunc = (catlist, name) => {
      //   let list = []
      //   catlist.map(cat => {
      //     if (cat.name === name) {
      //       list.push(cat.name)
      //       if (cat.children) {
      //         cat.children.map(cat2 => {
      //           list.push(cat2.name)
      //           if (cat2.children) {
      //             cat2.children.map(cat3 => {
      //               list.push(cat3.name)
      //             })
      //           }
      //         })

      //       }
      //     }
      //     else {
      //       cat.children.map(cat4 => {
      //         if (cat4.name === name) {
      //           list.push(cat4.name)
      //           if (cat4.children) {
      //             cat4.children.map(cat5 => {
      //               list.push(cat5.name)
      //               if (cat5.children) {
      //                 cat5.children.map(cat6 => {
      //                   list.push(cat6.name)
      //                 })
      //               }
      //             })

      //           }
      //         }
      //       })
      //     }
      //   })
      //   return list
      // }

      // console.log(myfunc(categoryList, 'mobile'));




      //console.log(get_children('electronics','mobile'));



      res.status(200).json({ categories: categoryList,flatCategories:categories });
    }
  });
};

exports.updateCategory =(req, res) => {
 // #swagger.tags = ['Category']
  // #swagger.summary = 'Update category'
  const { name ,categoryId,categoryImage} = req.body
  if (!name) {
      return res.status(400).json({ error: "Category name is required" })
  }

  Category.findByIdAndUpdate(categoryId,{$set:{name,categoryImage}},{new:true})
      .then(category => {
          res.status(200).json({ success: true, category })
      })
      .catch(err => {
          res.status(400).json({ error: "Something went wrong" })
      })
};

exports.deleteCategory =(req, res) => {
  // #swagger.tags = ['Category']
  // #swagger.summary = 'Delete category'
  const categoryId = req.body.categoryId;
  Category.findByIdAndDelete(categoryId)
  .then(cat=>{
    console.log(cat);
    res.status(200).json({success:true})
  })
  .catch(err=>{
    res.status(400).json({error:"something went wrong"})
  })
     

}


exports.bulkDownload=(req,res)=>{
  // #swagger.tags = ['Category']
  // #swagger.summary = 'download for csv'

  Category.find()
  .then(categories=>{
      res.status(200).json({success:true,categories})
  })
  .catch(err => {
      console.log(err);
    })
}