const mongoose = require("mongoose");
const Review = require("../models/review");


exports.createReview = (req, res) => {
    // #swagger.tags = ['Review']
    // #swagger.summary = 'Create review'
    const { product, order, rating, comment } = req.body
    if (!product) {
        return res.status(400).json({ error: "Product id is required" })
    }
    if (!order) {
        return res.status(400).json({ error: "Order id is required" })
    }
    if (!rating) {
        return res.status(400).json({ error: "Rating is required" })
    }
    if (rating < 1 || rating > 5) {
        return res.status(400).json({ error: "Rating should be between 1 and 5" })
    }
    let _review = new Review({
        user: req.user._id,
        product,
        order,
        rating,
        comment
    })


    Review.findOne({ product, order, user: req.user._id })
        .then(review => {
            if (review) {
                review.updateOne({ $set: { rating, comment: comment || "" } })
                    .then(review => {
                        res.status(201).json({ success: true, review })
                    })
                    .catch(err => {
                        res.status(400).json({ error: "Something went wrong" })
                    })
            } else {
                _review.save()
                    .then(review => {
                        res.status(201).json({ success: true, review })
                    })
                    .catch(err => {
                        res.status(400).json({ error: "Something went wrong" })
                    })
            }

        })
        .catch(err => {
            console.log(err);
        })




}


exports.getReview = async (req, res) => {
      // #swagger.tags = ['Review']
  // #swagger.summary = 'Get review'
    let { product } = req.params
    // Review.find({product})
    // .populate("user","name profilePicture")
    // .then(reviews=>{
    //     res.status(200).json({success:true,reviews})
    // })
    // .catch(err=>{
    //  res.status(400).json({error:"Something went wrong"})
    // })

    Review.aggregate([
        { $match: { product: mongoose.Types.ObjectId(product), isPublished: true } },
        {
            $group: {
                _id: "$rating",
                count: { $sum: 1 },
                totaStar: { $sum: { $multiply: [{ $sum: 1 }, "$rating"] } }
            }
        },
    ]).exec(async (error, result) => {
        let reviews = await Review.find({ product, "isPublished": true })
            .select("rating comment createdAt reply")
            .populate("user", "name profilePicture")
            .exec()
        let reviewsCount = result.reduce((a, b) => +a + +b.count, 0);
        let totalStarCount = result.reduce((a, b) => +a + +b.totaStar, 0);
        let average = (totalStarCount / reviewsCount).toFixed(1)
        res.status(200).json({ success: true, reviewsStats: result, reviews, reviewsCount, average })
    })
}


exports.getSingle = (req, res) => {
      // #swagger.tags = ['Review']
  // #swagger.summary = 'Get review per order'
    const { product, order } = req.params
    Review.findOne({ product, order, user: req.user._id })
        .then(review => {
            if (review) {
                return res.status(200).json({ hasReview: true, review })
            } else {
                return res.status(200).json({ hasReview: false, review })
            }

        })
        .catch(err => {
            console.log(err);
            res.status(400).json({ error: "Something went wrong" })
        })
}



exports.getAllReviews = (req, res) => {
      // #swagger.tags = ['Review']
  // #swagger.summary = 'Get all reviews'
    Review.find()
        .populate('user', 'name email')
        .populate("product", "name")
        .then(reviews => {
            return res.status(200).json({ success: true, reviews })
        })
        .catch(err => {
            console.log(err);
            res.status(400).json({ error: "Something went wrong" })
        })
}


exports.togglePublish = (req, res) => {
      // #swagger.tags = ['Review']
  // #swagger.summary = 'Tggle publish'
    let reviewId = req.params.reviewid
    let { isPublished } = req.body
    if (!reviewId) {
        return res.status(400).json({ error: "Review id is required" })
    }

    Review.findByIdAndUpdate(reviewId, { $set: { isPublished } }, { new: true })
        .populate('user', 'name mobile')
        .populate("product", "name")
        .then(review => {
            return res.status(200).json({ success: true, review })
        })
        .catch(err => {
            console.log(err);
            res.status(400).json({ error: "Something went wrong" })
        })

}


exports.updateReview = (req, res) => {
      // #swagger.tags = ['Review']
  // #swagger.summary = 'Update review'
    let reviewId = req.params.reviewid
    let { comment, reply } = req.body
    Review.findByIdAndUpdate(reviewId, { $set: { comment, reply } }, { new: true })
        .populate('user', 'name mobile')
        .populate("product", "name")
        .then(review => {
            return res.status(200).json({ success: true, review })
        })
        .catch(err => {
            console.log(err);
            res.status(400).json({ error: "Something went wrong" })
        })
}


exports.deleteReview = (req, res) => {
      // #swagger.tags = ['Review']
  // #swagger.summary = 'Delete review'
    let reviewId = req.params.reviewid
    Review.findByIdAndDelete(reviewId)
        .then(deleted => {
            return res.status(200).json({ success: true })
        })
        .catch(err => {
            console.log(err);
            res.status(400).json({ error: "Something went wrong" })
        })
}