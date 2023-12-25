const express = require("express");
const router = express.Router();
const userCtrl = require("../controllers/auth.controllers");
const {
  isUserNameOrEmailAlreadyExists,
  isValidPassword,
  getUserDetailsFromDB,
  checkAdmin,
} = require("../middlewares/index");
const verifyToken = require("../utils/verifyUserToken");

//@SignUp User

router.post(
  "/registerUser",
  isUserNameOrEmailAlreadyExists,
  userCtrl.registerUser
);

//@Login Users
router.post("/login", isValidPassword, userCtrl.login);

//@PATCH Edit User
router.patch(
  "/editUserById",
  verifyToken,
  getUserDetailsFromDB,
  userCtrl.editUserById
);

router.get("/getUserById", verifyToken, userCtrl.getUserById);

// update user status
router.patch(
  "/userStatusUpdate",
  verifyToken,
  checkAdmin,
  userCtrl.userStatusUpdate
);

router.get("/usersList", verifyToken, checkAdmin, userCtrl.usersList);

router.patch(
  "/salesPersonStatusUpdate",
  // verifyToken,
  userCtrl.salesPersonStatusUpdate
);



//

module.exports = router;
