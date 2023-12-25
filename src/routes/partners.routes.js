const express = require("express");
const router = express.Router();
// const verifyToken = require("../utils/verifyUserToken");
const ctrl = require("../controllers/partners.controller");
const {getPartnerDataFromDB} = require('./../middlewares/index');

/** @POST CREATE NEW PARTNER*/
router.post('/createpartner', ctrl.createPartner);

/**@GET PARTNER LIST  */
router.get('/partnerList', ctrl.partnerList);

/**@GET PARTNER BY ID */
router.get('/getPartnerById', ctrl.getPartnerById);

/**@PATCH EDIT PARTNER */
router.patch('/editpartner', getPartnerDataFromDB, ctrl.editPartner)

/**@DELETE A PARTNER */
router.delete('/deletePartner', ctrl.deletePartner)
module.exports = router;
