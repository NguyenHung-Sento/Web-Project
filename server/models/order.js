const mongoose = require('mongoose'); 

var orderSchema = new mongoose.Schema({
    product:[{
        product: {type: mongoose.Types.ObjectId, ref: 'Product'},
        count: Number,
    }],
    status:{
        type:String,
        default:'Proccessing',
        enum: ['Cancelled', 'Proccessing', 'Successed']
    },
    total: Number,
    paymentIntend:{},
    orderBy:{
        type:mongoose.Types.ObjectId,
        ref: 'User',
    },
});


module.exports = mongoose.model('Order', orderSchema);