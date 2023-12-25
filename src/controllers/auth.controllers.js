const userModel = require("./../models/user.model");
const messageTypes = require("../../responses/index");
const _ = require("lodash");
const httpStatus = require("http-status");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");

class Users {
  constructor() {
    this.message = messageTypes.user;
  }

  registerUser = async (req, res) => {
    try {
      const { name, email, password, mobile, gender, address, role } = req.body;
      const salesman = req.query.salesman;
      var salt = bcrypt.genSaltSync(parseInt(process.env.SALT));
      var hashPassword = bcrypt.hashSync(password, salt);
      let newRole;

      console.log(salesman);
      if (salesman) {
        newRole = "SALESMAN";
        // this.message.userCreatedSuccessfully = 'Sales person created successfully !'
      }
      let newUser = await userModel.create({
        name: name,
        email: email,
        mobile: mobile,
        profilePic: req.body.profilePic ? req.body.profilePic : "NA",
        password: hashPassword,
        gender: gender ? gender : "NA",
        address: address ? address : "NA",
        role: newRole,
      });
    

      if (newUser) {
        return res.status(httpStatus.CREATED).send({
          status: httpStatus.CREATED,
          message: this.message.userCreatedSuccessfully,
          data: newUser,
        });
      } else {
        return res.send({
          status: httpStatus.CONFLICT,
          message: this.message.failedToCreateUser,
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
  login = async (req, res) => {
    try {
      const payload = {
        _id: req.user._id,
        name: req.user.name,
        email: req.user.email,
        mobile: req.user.mobile,
      };
      const token = jwt.sign(payload, process.env.SECRET, { expiresIn: "30m" });
      payload["token"] = token;
      if (token) {
        await userModel.updateOne(
          { email: payload.email },
          { $set: { token: token } }
        );

        return res.send({
          status: httpStatus["200_NAME"],
          message: this.message.userLoggedInSuccessfully,
          data: payload,
        });
      }
    } catch (err) {
      return res.send({
        status: httpStatus.INTERNAL_SERVER_ERROR,
        message: httpStatus["500_NAME"],
      });
    }
  };
  editUserById = async (req, res) => {
    try {
      let userId = req.query.id;
      // console.log("---------------------------------------------------------------->",userId);
      // console.log("---`>", req.body.userDetails);

      let { name, mobile, gender, address, email } = req.body;

      let dataToUpdate = {
        name: name != undefined ? name : req.body.userDetails.name,
        address: address != undefined ? address : req.body.userDetails.address,
        mobile: mobile != undefined ? mobile : req.body.userDetails.mobile,
        gender: gender != undefined ? gender : req.body.userDetails.gender,
        email: email != undefined ? email : req.body.userDetails.email,
      };

      let updateUser = await userModel
        .findByIdAndUpdate(
          { _id: mongoose.Types.ObjectId(userId) },
          { $set: { ...dataToUpdate } },
          { new: true }
        )
        .lean();
      delete updateUser["token"];
      delete updateUser["__v"];

      return res.status(httpStatus.OK).send({
        status: httpStatus.OK,
        message: this.message.userUpdatedSuccessfully,
        data: updateUser,
      });
    } catch (err) {
      console.error(err);
      return res.status(httpStatus.INTERNAL_SERVER_ERROR).send({
        status: httpStatus.INTERNAL_SERVER_ERROR,
        message: httpStatus["500_NAME"],
      });
    }
  };

  getUserById = async (req, res) => {
    try {
      let id = req.query.id;
      const data = await userModel
        .findOne({ _id: mongoose.Types.ObjectId(id) })
        .select({ __v: 0 })
        .lean();
      return res.status(200).send({status:200, message:'User fetched successfully', data:data})
    } catch (err) {
      console.error(err);
      return res.status(httpStatus.INTERNAL_SERVER_ERROR).send({
        status: httpStatus.INTERNAL_SERVER_ERROR,
        message: httpStatus["500_NAME"],
      });
    }
  };

  // status update of a user
  userStatusUpdate = async (req, res) => {
    try {
      let userId = req.user._id;
      const userStatus = await userModel
        .findOne({ _id: mongoose.Types.ObjectId(userId) }, { status: 1 })
        .lean();
      let statusUpdate = userStatus.status == true ? false : true;
      let isUpdated = await userModel
        .findByIdAndUpdate(
          { _id: mongoose.Types.ObjectId(userId) },
          { $set: { status: statusUpdate } },
          { new: true }
        )
        .lean();
      return res.status(httpStatus.OK).send({
        status: httpStatus.OK,
        message: this.message.userStatusUpdatedSuccessfully,
        data: isUpdated,
      });
    } catch (err) {
      return res.status(httpStatus.INTERNAL_SERVER_ERROR).send({
        status: httpStatus.INTERNAL_SERVER_ERROR,
        message: httpStatus["500_NAME"],
      });
    }
  };
  usersList = async (req, res) => {
    try {
      let limit = !req.query.limit ? 10 : parseInt(req.query.limit),
        page = !req.query.page ? 1 : parseInt(req.query.page);

      let skip = (page - 1) * limit;
      let searchKey = req.query.search || "";
      let role = req.query.role || "USER";

      let query = {
        role: role,
      };

      if (searchKey !== undefined && searchKey !== "" && searchKey !== " ") {
        query = {
          ...query,
          name: { $regex: searchKey, $options: "is" },
        };
      }
      let totalUsers = await userModel.countDocuments({ ...query });
      const users = await userModel
        .find(
          { ...query },
          { profilePic: 0, updatedAt: 0, __v: 0, password: 0, token: 0 }
        )
        .sort({ name: -1 })
        .skip(skip)
        .limit(limit)
        .lean();

      let pageMeta = {
        total: totalUsers,
        skip: Number(skip),
        page: Math.ceil(totalUsers / limit),
      };

      return res.status(httpStatus.OK).send({
        status: httpStatus.OK,
        message: this.message.usersListFetchedSuccessfully,
        data: { users: users, pageMeta: pageMeta },
      });
    } catch (err) {
      return res.status(httpStatus.INTERNAL_SERVER_ERROR).send({
        status: httpStatus.INTERNAL_SERVER_ERROR,
        message: httpStatus["500_NAME"],
      });
    }
  };
  salesPersonStatusUpdate = async (req, res) => {
    try {
      const id = req.query.id;
      const checkStatus = await userModel.findOne({_id:mongoose.Types.ObjectId(id)}).lean();
      const statusUpdate = (!checkStatus.status)
      const isDeleted = await userModel.findOneAndUpdate(
        { _id: mongoose.Types.ObjectId(id) },
        { $set: { status: statusUpdate } },
        { new: true }
      );
      return res.status(httpStatus.OK).send({
        status: httpStatus.OK,
        message: this.message.salespersonstatusupdate,
        data: isDeleted,
      });
    } catch (err) {
      console.error(err);
      return res.status(httpStatus.INTERNAL_SERVER_ERROR).send({
        status: httpStatus.INTERNAL_SERVER_ERROR,
        message: httpStatus["500_NAME"],
      });
    }
  };
}

module.exports = new Users();
