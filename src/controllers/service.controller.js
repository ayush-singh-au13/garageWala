const serviceModel = require("./../models/services.model");
const httpStatus = require("http-status");
const { result } = require("lodash");
const servicesModel = require("./../models/services.model");

class Services {
  constructor() {}
  addService = async (req, res) => {
    try {
      let { serviceName, price, offer, image } = req.body;
      let payload = {
        serviceName: serviceName,
        image:image ? image : "NA",
        price: price,
        offer: offer,
      };
      const addService = await serviceModel.create({
        serviceName: serviceName,
        image: image,
        price: price,
        offer: offer,
      });
      if (addService) {
        return res.status(httpStatus.CREATED).send({
          status: httpStatus.CREATED,
          message: "Service created successfully !",
          data: payload,
        });
      }
    } catch (err) {
      console.error(err);
      return res.status(httpStatus.INTERNAL_SERVER_ERROR).send({
        status: httpStatus.INTERNAL_SERVER_ERROR,
        message: httpStatus["500_NAME"],
      });
    }
  };
  servicesList = async (req, res) => {
    try {
      let searchKey = req.query.search;
      let limit = !req.query.limit ? 10 : parseInt(req.query.limit);
      let page = !req.query.page ? 1 : parseInt(req.query.page);
      let skip = (page - 1) * limit;
      let query = {
        isDeleted: false
      };
      if (searchKey && searchKey !== undefined && searchKey !== "") {
        query = {
          ...query,
          serviceName: { $regex: searchKey, $options: "is" },
        };
      }
      const totalDocs = await servicesModel.countDocuments({ ...query });
      const result = await serviceModel
        .find({ ...query })
        .select({ __v: 0, isDeleted: 0 })
        .sort({ serviceName: -1 })
        .skip(skip)
        .limit(limit)
        .lean();
      await result.map((e) => {
        e['offerPrice'] = Math.round(Number(e.price)) - Math.round(Number(e.offer)/100 * Number(e.price));
        e['taxPrice'] = Math.round(Number(e.tax)/100 * Number(e.price));
        e['totalAmount'] = Math.round((Number(e.offerPrice) )+ Number(e.taxPrice))
      })
    
      const pageMeta = {
        totalDocs: totalDocs,
        skip: skip,
        pageSize: Math.ceil(totalDocs / limit),
      };
      // console.log("==========>", newResult);
      return res.status(httpStatus.OK).send({
        status: httpStatus.OK,
        message: "Services list fetched successfully",
        data: result, pageMeta:pageMeta
      });
    } catch (err) {
      return res.status(httpStatus.INTERNAL_SERVER_ERROR).send({
        status: httpStatus.INTERNAL_SERVER_ERROR,
        message: err.message,
      });
    }
  };
}

module.exports = new Services();
