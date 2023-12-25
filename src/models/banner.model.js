const { Schema, model } = require("mongoose");
const BannerSchema = new Schema(
  {
    bannerImage: {
      type: String,
    },
    bannerName: {
      type: String,
    },
    cloudinary_id: {
      type: String,
    },
    isDeleted:{
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true,
  }
);

module.exports = model("Banner", BannerSchema);
