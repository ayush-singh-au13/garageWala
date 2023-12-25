// const mongoose = require('mongoose');
const userModel = require("../models/user.model");
const _ = require("lodash");
const httpStatus = require("http-status");
const { default: mongoose } = require("mongoose");

module.exports = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const data = await userModel
      .findOne({ _id: mongoose.Types.ObjectId(userId) }, { role: 1 })
      .lean();
    if (data.role !== "SUPERADMIN") {
      return res.send({
        status: httpStatus.UNAUTHORIZED,
        message: "You are not allowed to access this api !",
      });
    }
    next();
  } catch (err) {
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).send({
      status: httpStatus.INTERNAL_SERVER_ERROR,
      message: httpStatus["500_NAME"],
    });
  }
};
