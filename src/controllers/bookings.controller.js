const { autoIncrement } = require("../models/counters.model");
const messageTypes = require("./../../responses/index");
const httpStatus = require("http-status");
const services = require("./../services/booking");
const mongoose = require("mongoose");

var admin = require("firebase-admin");

var serviceAccount = require("./../../nodelearning-f64a4-firebase-adminsdk-htq7x-09173dbe67.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

class Bookings {
  constructor() {
    this.message = messageTypes.bookings;
  }

  createBookings = async (req, res) => {
    try {
      console.log("creating new bookings !");
      let bookingId = await autoIncrement("bookings");
      // create a new booking
      const response = await services.createBookings(req.body, bookingId);

      return res.status(httpStatus.OK).send({
        status: httpStatus.OK,
        message: this.message.bookingscreatedsuccessfully,
        data: response,
      });
    } catch (err) {
      return res.status(httpStatus.INTERNAL_SERVER_ERROR).send({
        status: httpStatus.INTERNAL_SERVER_ERROR,
        message: httpStatus["500_NAME"],
      });
    }
  };
  bookingList = async (req, res) => {
    try {
      let searchKey = req.query.search;
      let limit = !req.query.limit ? 10 : parseInt(req.query.limit);
      let page = !req.query.page ? 1 : parseInt(req.query.page);
      let skip = (page - 1) * limit;
      let status = req.query.status;
      let data = await services.bookingList(limit, searchKey, skip,status);

      return res.status(httpStatus.OK).send({
        status: httpStatus.OK,
        message: this.message.bookinglistfetchedsuccessfully,
        ...data,
      });
    } catch (err) {
      console.error(err);
      return res
        .status(httpStatus.INTERNAL_SERVER_ERROR)
        .send({
          status: httpStatus.INTERNAL_SERVER_ERROR,
          message: httpStatus["500_NAME"],
        });
    }
  };
  viewBooking = async (req, res) => {
    try {
      const id = req.query.id;
      const data = await services.viewBooking(id);
      return res.status(httpStatus.OK).send({
        status: httpStatus.OK,
        message: this.message.bookingdetailsfetchedsuccessfully,
        data: data,
      });
    } catch (err) {
      console.error(err);
      return res.status(httpStatus.INTERNAL_SERVER_ERROR).send({
        status: httpStatus.INTERNAL_SERVER_ERROR,
        message: httpStatus["500_NAME"],
      });
    }
  };
  editBooking = async (req, res) => {
    try {
      const id = req.query.id;
      const {
        vehicleType,
        vehicleNo,
        customerName,
        phone,
        address,
        city,
        status,
        serviceType,
        partnerAssigned,
        reason,
        followedUpBy
      } = req.body;

      const dataToUpdate = {
        vehicleType: vehicleType ? vehicleType : req.body.data.vehicleType,
        vehicleNo: vehicleNo ? vehicleNo : req.body.data.vehicleNo,
        customerName: customerName ? customerName : req.body.data.customerName,
        phone: phone ? phone : req.body.data.phone,
        address: address ? address : req.body.data.address,
        city: city ? city : req.body.data.city,
        status: status ? status : req.body.data.status,
        serviceType: serviceType ? serviceType : req.body.data.serviceType
      };

      if (dataToUpdate.status === "GOAXLED") {
        console.log("=============>", partnerAssigned)
        if (!req.body.partnerAssigned )
          return res.send({ message: "Please assign a partner" });
        else dataToUpdate["partnerAssigned"] = mongoose.Types.ObjectId(partnerAssigned);
      }

      if (dataToUpdate.status === "OVERRIDE") {
        if (!req.body.reason) {
          return res.send({ message: "Please enter a reason !" });
        }
        dataToUpdate["reason"] = req.body.reason;
        dataToUpdate["followedUpBy"] = req.body.followedUpBy;
        // dataToUpdate["partnerAssigned"] = req.body.partnerId;
      }
      const isUpdated = await services.editBooking(id, dataToUpdate);
      return res.status(httpStatus.OK).send({
        status: httpStatus.OK,
        message: this.message.bookingupdated,
        data: isUpdated,
      });
    } catch (err) {
      console.log(err)
      return res.status(httpStatus.INTERNAL_SERVER_ERROR).send({
        status: httpStatus.INTERNAL_SERVER_ERROR,
        message: httpStatus["500_NAME"],
      });
    }
  };
  vehicleTypes = async (req, res) => {
    try {
      let searchKey = req.query.search;
      let limit = !req.query.limit ? 10 : parseInt(req.query.limit);
      let page = !req.query.page ? 1 : parseInt(req.query.page);
      let skip = (page - 1) * limit;
      let data = await services.getVehicleTypeData(limit, searchKey, skip);

      return res.status(httpStatus.OK).send({
        status: httpStatus.OK,
        message: this.message.vehicletypesfetchedsuccessfully,
        ...data,
      });
    } catch (err) {
      return res.status(httpStatus.INTERNAL_SERVER_ERROR).send({
        status: httpStatus.INTERNAL_SERVER_ERROR,
        message: httpStatus["500_NAME"],
      });
    }
  };
  addVehicleType = async (req, res) => {
    try {
      console.log("add a new vehicletype");
      const { name, credit } = req.body;
      if (!name || !credit)
        return res.send({ message: "Either name or credit field is missing" });
      const createVehicleType = await services.addVehicleType(name, credit);
      console.log(createVehicleType);
      res.status(httpStatus.OK).send({
        status: httpStatus.OK,
        message: this.message.vehicletypecreatedsuccessfully,
        data: createVehicleType,
      });
    } catch (err) {
      return res.status(httpStatus.INTERNAL_SERVER_ERROR).send({
        status: httpStatus.INTERNAL_SERVER_ERROR,
        message: httpStatus["500_NAME"],
      });
    }
  };
  vehicleTypesById = async (req, res) => {
    try {
      const id = req.query.id;

      const getVehicleTypeData = await services.vehicleTypesById(id);
      res.status(httpStatus.OK).send({
        status: httpStatus.OK,
        message: "Vehicle type data",
        data: getVehicleTypeData,
      });
    } catch (err) {
      return res.status(httpStatus.INTERNAL_SERVER_ERROR).send({
        status: httpStatus.INTERNAL_SERVER_ERROR,
        message: httpStatus["500_NAME"],
      });
    }
  };
  editVehicleType = async (req, res) => {
    try {
      const id = req.query.id;
      const { name, credit } = req.body;
      const vehicleType = await services.editVehicleType(
        req.body.data,
        id,
        name,
        credit
      );
      return res.status(httpStatus.OK).send({
        status: httpStatus.OK,
        message: this.message.vehicletypeupdated,
        data: vehicleType,
      });
    } catch (err) {
      console.log(err);
      return res.status(httpStatus.INTERNAL_SERVER_ERROR).send({
        status: httpStatus.INTERNAL_SERVER_ERROR,
        message: httpStatus["500_NAME"],
      });
    }
  };
  deleteVehicleType = async (req, res) => {
    try {
      const id = req.query.id;
      if (id === undefined) {
        return res.send({ message: "ID field is missing" });
      }
      const isDeleted = await services.deleteVehicleType(id);

      return res.status(httpStatus.OK).send({
        status: httpStatus.OK,
        message: this.message.vehicletypedeleted,
        data: isDeleted,
      });
    } catch (err) {
      console.log(err);
      return res.status(httpStatus.INTERNAL_SERVER_ERROR).send({
        status: httpStatus.INTERNAL_SERVER_ERROR,
        message: httpStatus["500_NAME"],
      });
    }
  };
}

module.exports = new Bookings();
