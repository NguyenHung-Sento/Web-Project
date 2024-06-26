const mongoose = require('mongoose'); 

var productSchema = new mongoose.Schema({
    title:{
        type:String,
        required:true,
        trim: true
    },
    slug:{
        type:String,
        required:true,
        unique:true,
        lowercase: true
    },
    description:{
        type: Array,
        required:true,
    },
    brand:{
        type:String,
        required:true,
    },
    price:{
        type:Number,
        required:true,
    },
    category: {
        type:String,
        required:true,
    },
    productType: {
        type:String,
        required:true,
    },
    quantity:{
        type:Number,
        default:0,
    },
    sold:{
        type:Number,
        default:0,
    },
    thumb:{
        type:Array,
        required:true,
    },
    images:{
        type:Array,
    },
    ratings:{
        star:{type:Number},
        postBy:{type:mongoose.Types.ObjectId, ref:'User'},
        comment:{type:String},
    },
    totalRatings:{
        type:Number,
        default:0,
    }
},{
    timestamps:true
});


module.exports = mongoose.model('Product', productSchema);