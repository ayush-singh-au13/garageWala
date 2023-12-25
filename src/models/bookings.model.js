const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const bookingSchema = new Schema(
  {
    vehicleType: {
      type: String,
      required: true,
    },
    vehicleNo: {
      type: String,
    },
    doorstep:{
      type:Boolean,
      default: false
    },
    customerName: {
      type: String,
    },
    language:{
      type: String,
      default: 'Hindi',
      enum:['Hindi','English','Telugu']
    },
    bookingId: {
      type: String,
    },
    phone: {
      type: String,
      required: true,
    },
    address: {
      type: String,
    },
    city: {
      type: String,
    },
    status: {
      type: String,
      default: "NEW",
      enum: ["NEW", "OVERRIDE", "GOAXLED", "COMPLETE"],
    },
    serviceType: {
      type: String,
    },
    pickupLocation:{
      type:String
    },
    partnerAssigned: {
      type: Schema.Types.ObjectId,
      ref: "partners",
    },
    reason: {
      type: String,
      enum: [
        "Partner is not picking up the call",
        "Garage is closed",
        "Partner not available",
        "Road is blocked",
        "Other Issue",
      ],
    },
    followedUpBy: {
      type: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Bookings", bookingSchema);
