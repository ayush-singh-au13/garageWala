const express = require('express');
const router = express.Router();
const ctrl = require('./../controllers/service.controller');

/**add services */
router.post('/addService', ctrl.addService);

/**get services listing */
router.get('/servicesList', ctrl.servicesList)
module.exports = router;