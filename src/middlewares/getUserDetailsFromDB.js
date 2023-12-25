// const mongoose = require('mongoose');
const userModel = require("../models/user.model");
const _ = require("lodash");
const mongoose = require("mongoose");

module.exports = async (req, res, next) => {
  try {
    const userId = req.query.id;
    const userDetail = await userModel
      .findOne({
        _id: mongoose.Types.ObjectId(userId),
        // status: true
      })
      .lean();

    // console.log("---`>",userDetail);

    req.body.userDetails = { ...userDetail };

    next();
  } catch (err) {
    return res
      .status(500)
      .json({ status: 500, message: httpStatus["500_NAME"] });
  }
};
