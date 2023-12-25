// const mongoose = require('mongoose');
const userModel = require("../models/user.model");
const _ = require("lodash");
const httpStatus = require("http-status");

module.exports = async (req, res, next) => {
  try {
    const { email, mobile } = req.body;
    const isUserNameExists = await userModel
      .findOne({ email: email })
      .lean();


    if (!_.isEmpty(isUserNameExists)) {
      return res.send({
        message: "User Already Exists, Please try with a different email!!",
      });
    }
    const isEmailExists = await userModel.findOne({ mobile: mobile }).lean();
    if (!_.isEmpty(isEmailExists)) {
      return res.send({
        message: "User Already Exists, Please try with a different mobile number!!",
      });
    }
    next();
  } catch (err) {
    console.error(err);
    return res.status(500).json({status: 500, message: httpStatus['500_NAME']});
  }
};
