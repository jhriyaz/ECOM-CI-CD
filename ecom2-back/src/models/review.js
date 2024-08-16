const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true,index:true },
    order: { type: mongoose.Schema.Types.ObjectId, ref: 'Order', required: true ,index:true},
    rating:{type:Number,default:0,min:0,max:5},
    comment:{type:String,default:""},
    isPublished:{type:Boolean,default:true},
    reply:{
        name:String,
        profile:String,
        comment:String,
    }
    
}, { timestamps: true });


module.exports = mongoose.model('Review', reviewSchema);