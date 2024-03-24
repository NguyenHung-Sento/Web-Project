const {default : mongoose} = require('mongoose')
const dbConnect = async () => {
    try{
        const cn = await mongoose.connect(process.env.MONGODB_URI)
        if (cn.connection.readyState === 1) console.log('Connect successfully')
        else console.log('DB connecting')
    } catch (error){
        console.log("DB's connection is failed")
        throw new Error(error)
    }
}
module.exports = dbConnect