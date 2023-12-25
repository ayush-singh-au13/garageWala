const express = require("express");
const router = express.Router();
const verifyToken = require("./../utils/verifyUserToken");
const bookingsCtrl = require("../controllers/bookings.controller");
const {
  vehicleTypeDataFromDB,
  bookingDetailsFromDB,
} = require("./../middlewares/index");

/**@POST CREATE NEW BOOKINGS */
router.post("/createBookings", verifyToken, bookingsCtrl.createBookings);

/**@GET BOOKING LIST */
router.get("/bookingList", verifyToken, bookingsCtrl.bookingList);

/**@GET VIEW BOOKINGS BY ID */
router.get("/viewBooking", verifyToken, bookingsCtrl.viewBooking);

/**@PATCH EDIT BOOKINGS BY ID */
router.patch(
  "/editBooking",
  verifyToken,
  bookingDetailsFromDB,
  bookingsCtrl.editBooking
);

/**@GET LIST OF VEHICLETYPES DROPDOWN */
router.get("/vehicleTypes", verifyToken, bookingsCtrl.vehicleTypes);

/**@POST ADD VEHICLETYPE */
router.post("/addVehicleType", verifyToken, bookingsCtrl.addVehicleType);

/**@GET VEHICLETYPE by ID */
router.get("/vehicleTypesById", verifyToken, bookingsCtrl.vehicleTypesById);

/**@PATCH VEHICLETYPE */
router.patch(
  "/editVehicleType",
  verifyToken,
  vehicleTypeDataFromDB,
  bookingsCtrl.editVehicleType
);

/**@DELETE VEHICLETYPE */
router.delete(
  "/deleteVehicleType",
  verifyToken,
  bookingsCtrl.deleteVehicleType
);

module.exports = router;
