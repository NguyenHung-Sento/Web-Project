const mongoose = require('mongoose'); 
const bcrypt = require('bcrypt')
const crypto = require('crypto')

var userSchema = new mongoose.Schema({
    firstname:{
        type:String,
        required: true,
    },
    lastname:{
        type:String,
        required: true,
    },
    email:{
        type:String,
        required: true,
        unique: true,
    },
    mobile:{
        type:String,
        required: true,
        unique: true,
    },
    password:{
        type:String,
        required: true,
    },
    role:{
        type:String,
        enum: ['user', 'admin'],
        default: 'user',
    },
    cart:[{
        product: {type: mongoose.Types.ObjectId, ref: 'Product'},
        quantity: Number
    }],
    address:{
        type:String,
    },
    wishlist:[
        {type : mongoose.Types.ObjectId, ref: 'Product'}
    ],
    isBlocked:{
        type: Boolean,
        default: false,
    },
    refreshToken:{
        type: String,
    },
    passwordChangAt:{
        type: String,
    },
    passwordResetToken:{
        type: String,
    },
    passwordResetExpire:{
        type: String,
    },
},{
    timestamps: true,
});

userSchema.pre('save', async function (next){
    if(!this.isModified('password')){
        next()
    }
    const salt = bcrypt.genSaltSync(10)
    this.password = await bcrypt.hash(this.password, salt)
})

userSchema.methods = {
    isCorrectPassword : async function(password) {
        return await bcrypt.compare(password, this.password)
    },
    createPasswordChangeToken : function(){
        const resetToken = crypto.randomBytes(32).toString('hex')
        this.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex')
        this.passwordResetExpire = Date.now() + 15*60*1000
        return resetToken
    }
}

module.exports = mongoose.model('User', userSchema);