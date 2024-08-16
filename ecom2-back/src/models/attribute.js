const mongoose = require('mongoose');

const attributeSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    values: [
        {
            type:String
        }
    ]
}, { timestamps: true });


module.exports = mongoose.model('Attribute', attributeSchema);