const express = require("express");
const router = express.Router();
const verifyToken = require("../utils/verifyUserToken");
const ctrl = require("../controllers/dashboard.controller");

router.get("/dashboardDetails", 
verifyToken, 
ctrl.dashboardDetails
);

module.exports = router;
