const bookingModel = require("./../models/bookings.model");
const vehicleTypesModel = require("./../models/vehicleType.model");
const mongoose = require("mongoose");
const vehicleTypeModel = require("./../models/vehicleType.model");


class Dashboard {
  constructor() {}
  createBookings = async (payload, bookingId) => {
    const dataToUpdate = await bookingModel.create({
      vehicleType: payload.vehicleType,
      vehicleNo: payload.vehicleNo,
      customerName: payload.customerName,
      phone: payload.phone,
      city: payload.city,
      address: payload.address,
      bookingId: (bookingId.seq).toString(),
      serviceType: payload.serviceType,
      pickupLocation: payload.pickupLocation ? payload.pickupLocation : "",
      language : payload.language ? payload.language : "Hindi",
      doorstep : payload.doorstep ? payload.doorstep : false
    });
    return dataToUpdate;
  };
  bookingList = async (limit, searchKey, skip,status) => {
    let query = {
      status: status,
    };
    if (searchKey && searchKey !== undefined && searchKey !== "") {
      skip = 0;
      query = {
        ...query,
        $or: [
          { bookingId: Number(searchKey) },
          { customerName: { $regex: searchKey, $options: "is" } },
          {address: { $regex: searchKey, $options: "is"}}
        ],
      };
    }

    const total = await bookingModel.countDocuments({ ...query });
    const data = await bookingModel
      .find({ ...query })
      .select({ __v: 0 })
      .sort({ bookingId: -1 })
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
  viewBooking = async (id) => {
    const bookingsData = await bookingModel
      .findOne({ _id: mongoose.Types.ObjectId(id) })
      .select({ __v: 0 })
      .lean();
    return bookingsData;
  };
  editBooking = async (id, payload) => {
    // console.log("=====>", payload);
    const updateBooking = await bookingModel.findByIdAndUpdate(
      {
        _id: mongoose.Types.ObjectId(id),
      },
      { $set: { ...payload } },
      { new: true }
    );
    return updateBooking;
  };
  getVehicleTypeData = async (limit, searchKey, skip) => {
    let query = {
      isDeleted: false,
    };

    if (searchKey && searchKey !== undefined && searchKey !== "") {
      skip = 0;
      query = {
        ...query,
        name: { $regex: searchKey, $options: "is" },
      };
    }

    const total = await vehicleTypesModel.countDocuments({ ...query });
    const data = await vehicleTypesModel
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
  addVehicleType = async (name, credit) => {
    let createVehicleType;
    createVehicleType = await vehicleTypesModel.create({
      name: name,
      credit: credit,
    });
    // return;
    return createVehicleType;
  };
  vehicleTypesById = async (id) => {
    const data = await vehicleTypesModel
      .find({ _id: mongoose.Types.ObjectId(id) })
      .lean();
    return data;
  };
  editVehicleType = async (data, id, name, credit) => {
    const payload = {
      name: name !== undefined ? name : data.name,
      credit: credit !== undefined ? credit : data.credit,
    };
    const isUpdated = await vehicleTypesModel.findByIdAndUpdate(
      { _id: mongoose.Types.ObjectId(id) },
      { $set: { ...payload } },
      { new: true }
    );
    // console.log(isUpdated);
    return isUpdated;
  };
  deleteVehicleType = async (id) => {
    const isupdate = await vehicleTypeModel.findByIdAndUpdate(
      { _id: mongoose.Types.ObjectId(id) },
      {
        $set: {
          isDeleted: true,
        },
      },
      { new: true }
    );
    return isupdate;
  };
}

module.exports = new Dashboard();
