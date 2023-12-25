const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
    },
    mobile: {
      type: Number,
      required: true,
      match: [
        /^([0|\+[0-9]{1,5}])?([0-9]{10})$/,
        "Please provide a valid mobile number.",
      ],
    },

    email: {
      type: String,
      required: true,
      trim: true,
    },
    profilePic: {
      type: String,
    },
    password: {
      type: String,
      required: true,
    },
    gender: {
      type: String
    },
    token: {
      type: String,
    },
    address: {
      type: String,
    },
    role:{
      type: String,
      default: 'USER',
      enum:['USER','SUPERADMIN','SALESMAN']
    },
    status: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

userSchema.index({
  name: 1,
});

module.exports = mongoose.model("User", userSchema);
