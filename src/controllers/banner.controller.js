const services = require("./../services/banner");
const httpStatus = require("http-status");
const message = require("./../../responses/user");
const { response } = require("express");

exports.bannerList = async (req, res) => {
  try {
    let page = !req.query.page ? 1 : parseInt(req.query.page),
      limit = !req.query.limit ? 10 : parseInt(req.query.limit),
      searchKey = req.query.search;
    let skip = (page - 1) * limit;

    const list = await services.bannerList(limit, skip, searchKey);

    return res.status(httpStatus.OK).send({
      status: httpStatus.OK,
      message: "Banner List fetched successfully !",
      ...list,
    });
  } catch (err) {
    console.error(err);
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).send({
      status: httpStatus.INTERNAL_SERVER_ERROR,
      message: httpStatus["500_NAME"],
    });
  }
};

exports.deleteBanner = async ( req,res) => {
  try {
    const id = req.query.id;
    const isDeleted = await services.deleteBanner(id);
    console.log(isDeleted);
    res.status(200).send({status:200, message:'Banner deleted successfully'})
  }catch(err) {
    console.error(err);
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).send({
      status: httpStatus.INTERNAL_SERVER_ERROR,
      message: httpStatus["500_NAME"],
    });
  } 
}
