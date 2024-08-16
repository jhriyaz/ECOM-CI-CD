const Brand = require('../models/brand')
const slugify = require('slugify')
const shortId = require('shortid')
const csv = require('fast-csv');
const mongoose = require("mongoose");

exports.getBrand = (req, res) => {
    // #swagger.tags = ['Brand']
    // #swagger.summary = 'Get brands'
    Brand.find()
        .then(brands => {
            res.status(200).json({ success: true, brands })
        })
        .catch(err => {
            console.log(err);
            res.status(400).json({ error: "something went wrong" })
        })

}
exports.createBrand = (req, res) => {
    // #swagger.tags = ['Brand']
    // #swagger.summary = 'Create brand'
    const { name, image, status } = req.body
    if (!name) {
        res.status(400).json({ error: "Name is required" })
    }
    if(!image){
        res.status(400).json({ error: "Image is required" })
    }
    let _brand = new Brand({
        name,
        slug: slugify(name) + "-" + shortId.generate(),
        image,
        status,
    })
    _brand.save()
        .then(brand => {
            res.status(201).json({ success: true, brand })
        })
        .catch(err => {
            console.log(err);
            res.status(400).json({ error: "something went wrong" })
        })
}
exports.updateBrand = (req, res) => {
    // #swagger.tags = ['Brand']
    // #swagger.summary = 'Update brand'

    const { name, image, status } = req.body
    const _id = req.params.id

    if (!_id || !mongoose.isValidObjectId(_id)) {
        return res.status(400).json({ error: "Invalid Brand ID" });
    }
    
    let brandData = {
        status: false
    }

    if (name) {
        brandData["name"] = name
    }
    if (image) {
        brandData["image"] = image
    }
    if (status) {
        brandData["status"] = status
    }


    Brand.findByIdAndUpdate(_id, { $set: brandData }, { new: true })
        .then(brand => {
            res.status(200).json({ success: true, brand })
        })
        .catch(err => {
            //console.log(err);
            res.status(400).json({ error: "something went wrong" })
        })

}
exports.deleteBrand = (req, res) => {
    // #swagger.tags = ['Brand']
    // #swagger.summary = 'Delete brand'
    const _id = req.params.id

    if (!_id || !mongoose.isValidObjectId(_id)) {
        return res.status(400).json({ error: "Invalid Brand ID" });
    }
    
    Brand.findByIdAndDelete(_id)
        .then(brand => {
            res.status(200).json({ success: true })
        })
        .catch(err => {
            console.log(err);
            res.status(400).json({ error: "something went wrong" })
        })
}




exports.bulkEdit = async (req, res) => {
    // #swagger.tags = ['Brand']
    // #swagger.summary = 'Bulk edit brands'
    let { ids, status } = req.body
    if (ids.length === 0) {
        return res.status(200).json({ success: true, brands: [] })
    }

    let data = { status }

    Brand.updateMany({ _id: ids }, { $set: data }, { new: true })
        .then(updated => {

            Brand.find({ _id: { $in: ids } })
                .then(brands => {

                    res.status(200).json({ success: true, brands })
                })

        })
        .catch(err => {
            console.log(err);
        })


}



exports.bulkDelete = (req, res) => {
    // #swagger.tags = ['Brand']
    // #swagger.summary = 'Bulk delete brands'
    let { ids } = req.body
    if (ids.length === 0) {
        return res.status(200).json({ success: true, brands: [] })
    }

    Brand.deleteMany({ _id: ids })
        .then(deleted => {
            res.status(200).json({ success: true })
        })
        .catch(err => {
            console.log(err);
        })
}


exports.bulkDownload = (req, res) => {
    // #swagger.tags = ['Brand']
    // #swagger.summary = 'Get all for csv generation'
    Brand.find()
        .then(brands => {
            res.status(200).json({ success: true, brands })
        })
        .catch(err => {
            console.log(err);
        })
}



//-----------------------------------------------------------------------------------------------------------------------------

exports.bulkUpload = async (req, res) => {
    // #swagger.tags = ['Brand']
    // #swagger.summary = 'Bulk upload'
    if (!req.files)
        return res.status(400).send('No files were uploaded.');
    //console.log(req.files)
    var brandFile = req.files.file;


    let csvData = [];

    csv.parseString(brandFile.data.toString())
        .on('error', error => console.error(error))
        .on('data', async (data) => {
            csvData.push({
                _id: new mongoose.Types.ObjectId(),
                name: data[0],
                slug: slugify(data[0]) + "-" + shortId.generate(),
                image: data[1],
            });
        })
        .on('end', rowCount => {
            csvData.shift();
            console.log((csvData));

            Brand.create(csvData, function (err, documents) {
                if (err) return res.status(400).json({ error: "invalid brand csv file" });
                res.status(200).json({
                    success: true,
                    brands: documents
                })
            });

        });
}


