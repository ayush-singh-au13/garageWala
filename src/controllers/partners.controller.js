// const services = require("./../services/dashboard");
const { response } = require("express");
const httpStatus = require("http-status");
const messageTypes = require("./../../responses/index");
const services = require("./../services/partner");

class Patners {
  constructor() {
    this.message = messageTypes.partner;
  }

  createPartner = async (req, res) => {
    try {
      const createpartner = await services.createPartner(req.body);

      return res.status(httpStatus.CREATED).json({
        status: httpStatus.CREATED,
        message: this.message.partnercreated,
        data: createpartner,
      });
    } catch (err) {
      console.error(err);
      return res.status(httpStatus.INTERNAL_SERVER_ERROR).send({
        status: httpStatus.INTERNAL_SERVER_ERROR,
        message: httpStatus["500_NAME"],
      });
    }
  };
  partnerList = async (req, res) => {
    try {
      let searchKey = req.query.search;
      let limit = !req.query.limit ? 10 : parseInt(req.query.limit);
      let page = !req.query.page ? 1 : parseInt(req.query.page);
      let skip = (page - 1) * limit;
      const data = await services.partnerList(limit, searchKey, skip);
      // console.log(data);
      return res.status(httpStatus.OK).send({
        status: httpStatus.OK,
        message: this.message.partnersfetchedsuccessfully,
        ...data,
      });
    } catch (err) {
      console.error(err);
      return res.status(httpStatus.INTERNAL_SERVER_ERROR).send({
        status: httpStatus.INTERNAL_SERVER_ERROR,
        message: httpStatus["500_NAME"],
      });
    }
  };
  editPartner = async (req, res) => {
    try {
      const id = req.query.id;
      const {
        name,
        mobile,
        shopName,
        email,
        status,
        credits,
        address,
        pincode,
      } = req.body;

      const dataToUpdate = {
        name: name !== undefined ? name : req.body.partnerDetails.name,
        mobile: mobile !== undefined? mobile : req.body.partnerDetails.mobile,
        shopName: shopName !== undefined ? shopName : req.body.partnerDetails.shopName,
        email: email !== undefined ? email : req.body.partnerDetails.email,
        status: status !== undefined ? status : req.body.partnerDetails.status,
        credits: credits !== undefined ? credits : req.body.partnerDetails.credits,
        address: address !== undefined ? address : req.body.partnerDetails.address,
        pincode: pincode !== undefined ? pincode : req.body.partnerDetails.pincode,
      };
      const isUpdated = await services.editPartner(dataToUpdate, id);
      return res
        .status(httpStatus.OK)
        .send({
          status: httpStatus.OK,
          message: this.message.partnerupdatedsuccessfully,
          data: isUpdated,
        });
    } catch (err) {
      console.error(err);
      return res.status(httpStatus.INTERNAL_SERVER_ERROR).send({
        status: httpStatus.INTERNAL_SERVER_ERROR,
        message: httpStatus["500_NAME"],
      });
    }
  };
  getPartnerById = async (req, res) => {
    try {
      const id = req.query.id;
      const partner = await services.getPartnerById(id);
      return res.status(httpStatus.OK).send({status: httpStatus.OK, message: this.message.partnerdetailsfetchedsuccessfully, data:partner});
    }catch (err) {
      console.error(err);
      return res.status(httpStatus.INTERNAL_SERVER_ERROR).send({
        status: httpStatus.INTERNAL_SERVER_ERROR,
        message: httpStatus["500_NAME"],
      });
    }
  }
  deletePartner = async (req, res) => {
    try {
      const id = req.query.id;
      const isDeleted = await services.deletePartner(id);
      return res.status(httpStatus.OK).send({status: httpStatus.OK, message: this.message.partnerdeleted})
    }catch (err) {
      console.error(err);
      return res.status(httpStatus.INTERNAL_SERVER_ERROR).send({
        status: httpStatus.INTERNAL_SERVER_ERROR,
        message: httpStatus["500_NAME"],
      });
    }
  }
}

module.exports = new Patners();
