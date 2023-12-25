// const mongoose = require('mongoose');
const partnerModel = require("../models/partners.model");
const _ = require("lodash");
const mongoose = require("mongoose");
const httpStatus = require("http-status");

module.exports = async (req, res, next) => {
  try {
    const partnerId = req.query.id;
    const partnerDetail = await partnerModel
      .findOne({
        _id: mongoose.Types.ObjectId(partnerId)
      })
      .lean();

    req.body.partnerDetails = { ...partnerDetail };

    next();
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ status: 500, message: httpStatus["500_NAME"] });
  }
};
