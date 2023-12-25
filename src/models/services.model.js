const { model, Schema } = require("mongoose");
const ServicesSchema = new Schema(
  {
    serviceName: {
      type: String,
      required: true,
    },
    serviceCredits: {
      type: String,
      required: true,
    },
    price: {
      type: String,
    },
    offer: {
      type: String
    },
    description : {
      type: String
    },
    image:{
      type: String
    },
    isDeleted: {
      type: Boolean,
      default: false
    }
  },
  { timestamps: true }
);
module.exports =    model('Services', ServicesSchema);