const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const partnerSchema = new Schema(
  {
    mechanicId:{
        type: Number
    },
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
    },
    mobile: {
      type: Number,
      required: true,
      match: [
        /^([0|\+[0-9]{1,5}])?([0-9]{10})$/,
        "Please provide a valid mobile number.",
      ],
    },
    vehicleType:{
        type: String,
        // required:true
    },
    shopName:{
        type:String,
        required: true
    },
    email: {
      type: String
    },
    status: {
      type: Boolean,
      default: true,
    },
    credits:{
        type: Number,
        default: 50
    },
    shopImage:{
      type:String
    },
    address:{
      type:String,
      required:true
    },
    pincode:{
      type:String,
      required:true
    }
  },
  { timestamps: true }
);

partnerSchema.index({
  name: 1,
});

module.exports = mongoose.model("Partners", partnerSchema);
