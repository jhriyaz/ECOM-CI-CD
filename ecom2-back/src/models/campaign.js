const mongoose = require('mongoose');

const campaignSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
        trim:true
    },
    slug:{
        type:String,
        required:true,
        trim:true,
        unique:true
    },
    description:{
        type:String,
        default:""
    },
    image: 
        {
            type:String
        },
    
    isActive:{
        type:Boolean,
        default:true
    },
    startAt:{
        type:Date,
        require:true
    },
    endAt:{
        type:Date,
        require:true
    }
   
}, { timestamps: true });


module.exports = mongoose.model('Campaign', campaignSchema);