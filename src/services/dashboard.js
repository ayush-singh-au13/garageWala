const userModel = require('./../models/user.model');
const bookingModel = require('./../models/bookings.model');
const modalModel  = require('./../models/modal.model');
const partnersModel = require('../models/partners.model');

class Dashboard {
    constructor(){

    }

    getUserCount = async () => {
        const count = await userModel.countDocuments({'role':'USER'});
        return count;
    }
    getSalespersonCount = async () => {
        const count = await userModel.countDocuments({'role':'SALESMAN'});
        return count;
    }
    getBookingsCount = async () => {
        const count = await bookingModel.countDocuments({status:'NEW'});
        return count;
    }
    getOverrideCount = async () => {
        const count = await bookingModel.countDocuments({status:'OVERRIDE'});
        return count
    }
    getGoaxledCount = async () => {
        const count = await bookingModel.countDocuments({status:'GOAXLED'});
        return count
    }
    getModalCount = async () => {
        const count = await modalModel.countDocuments({});
        return count
    }
    getPartnerCount = async () => {
        const count = await partnersModel.countDocuments({});
        return count
    }

}

module.exports = new Dashboard();