const mongoose = require('mongoose');
const productSchema = new mongoose.Schema({
    name: { 
        type: String, 
        required: true, 
        trim: true 
    },
    slug: { 
        type: String, 
        required: true, 
        unique: true ,
        index: true
    },
    description: {
        type: String,
        trim: true
    },
    unit:{type:String},
    tags:[{type:String}],
    thumbnail:{type:String},
    gallery:[{type:String}],
    attributes:[],
    variations:[],
    productType:{type:String,default:"simple"},
    price:{type:Number,required:true},
    discount:{
        discountType:String,
        value:Number
    },
    tax:{
        taxType:String,
        value:Number
    },
    sku:{type:String},
    stock:{type:Number},
    shipping:{
        isFree:Boolean,
        cost:Number
    },
    meta:{
        title:{type:String},
        description:{type:String},
        image:{type:String},
    },
    brand:{ type: mongoose.Schema.Types.ObjectId, ref: 'Brand', index: true },
    categories: [
        {
            level:{type:Number,required:true},
            category:{ type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true }
        }
    ],
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    isActive:{type:Boolean,default:true},
    isFeatured:{type:Boolean,default:false},
    sales:{type:Number,default:0},
    campaigns:[{
        campaign:{type: mongoose.Schema.Types.ObjectId, ref: 'Campaign'},
        discount:{ discountType:{type:String,default:'falt'},value:{type:Number,default:0}}
    }]

}, { timestamps: true });


module.exports = mongoose.model('Product', productSchema);