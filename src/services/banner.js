const bannerModel = require("./../models/banner.model");
const mongoose = require("mongoose");
const cloudinary = require("./../utils/cloudinary");

class Banner {
  constructor() {}
  bannerList = async (limit, skip, searchKey) => {
    let query = {
      isDeleted: false
    };
    if (searchKey && searchKey !== undefined && searchKey !== "") {
      query = {
        ...query,
        bannerName: { $regex: searchKey, $options: "is" },
      };
    }
    const total = await bannerModel.countDocuments({ ...query });
    const list = await bannerModel
      .find({ ...query })
      .select({ __v: 0 })
      .sort({createdAt:-1})
      .skip(skip)
      .limit(limit)
      .lean();

    const pageMeta = {
      total: total,
      skip: skip,
      pageSize: Math.ceil(total / limit),
    };
    return { list, pageMeta };
  };
  deleteBanner = async (id) => {
    const data = await bannerModel.findByIdAndUpdate(
      { _id: mongoose.Types.ObjectId(id)},
      { $set: {isDeleted:true} },
      {new: true}
    );

    return data;
  };
}

module.exports = new Banner();
