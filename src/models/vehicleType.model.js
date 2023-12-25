const {Schema, model} = require("mongoose");

const vehicleTypeSchema = new Schema({
    'name':{
        type: String
    },
    'credit':{
        type: String
    },
    'isDeleted':{
        type:Boolean,
        default:false
    }
    
},{timestamps:true});

module.exports = model('vehicletypes', vehicleTypeSchema)