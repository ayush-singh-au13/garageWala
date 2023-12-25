const partnerModel = require("./../models/partners.model");
const { autoIncrement } = require("./../models/counters.model");
const mongoose = require("mongoose");

class Partner {
  constructor() {}

  createPartner = async (payload) => {
    const id = await autoIncrement("partners");
    console.log(id);

    const isCreated = await partnerModel.create({
      name: payload.name,
      email: payload.email,
      mobile: payload.mobile,
      mechanicId: id.seq,
      credits: payload.credits,
      shopName: payload.shopName,
      address: payload.address,
      pincode: payload.pincode,
    });
    return isCreated;
  };

  partnerList = async (limit, searchKey, skip) => {
    let query = {
      status: true,
    };

    if (searchKey && searchKey !== undefined && searchKey !== "") {
      skip = 0;
      query = {
        ...query,
        $or: [
          { name: { $regex: searchKey, $options: "is" } },
          { address: { $regex: searchKey, $options: "is" } },
          { pincode: { $regex: searchKey, $options: "is" } },
        ],
      };
    }
    const total = await partnerModel.countDocuments({ ...query });
    const data = await partnerModel
      .find({ ...query })
      .select({ __v: 0 })
      .sort({ name: 1 })
      .skip(skip)
      .limit(limit)
      .lean();
    const pageMeta = {
      total: total,
      skip: skip,
      pageSize: Math.ceil(total / limit),
    };

    return { data, pageMeta };
  };
  getPartnerById = async (id) => {
    const data = await partnerModel
      .findOne({ _id: mongoose.Types.ObjectId(id) })
      .lean();
    return data;
  };
  editPartner = async (payload, id) => {
    console.log(payload, id);
    const dataToUpdate = await partnerModel.findByIdAndUpdate(
      { _id: mongoose.Types.ObjectId(id) },
      { $set: { ...payload } },
      { new: true }
    );
    return dataToUpdate;
  };
  deletePartner = async (id) => {
    const deletePartner = await partnerModel.findByIdAndUpdate(
      { _id: mongoose.Types.ObjectId(id) },
      { $set: { status: false } },
      { new: true }
    );
    return deletePartner;
  };
}

module.exports = new Partner();
