const mongoose = require('mongoose'); 


var productCategorySchema = new mongoose.Schema({
    title:{
        type:String,
        required:true,
        unique:true,
        index:true,
    },
    productType:{
        type: Array,
        required: true,
    },
    image:{
        type: String,
        required :true,
    }
},{
    timestamps:true
});


module.exports = mongoose.model('ProductCategory', productCategorySchema);