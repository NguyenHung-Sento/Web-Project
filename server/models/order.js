const mongoose = require('mongoose'); 

var orderSchema = new mongoose.Schema({
    products:[{
        product: {type: mongoose.Types.ObjectId, ref: 'Product'},
        count: Number,
        title: String,
        thumb: String,
    }],
    status:{
        type:String,
        default:'Processing',
        enum: ['Cancelled', 'Processing', 'Succeed']
    },
    total: Number,
    orderBy:{
        type:mongoose.Types.ObjectId,
        ref: 'User',
    },
},{
    timestamps:true
});


module.exports = mongoose.model('Order', orderSchema);