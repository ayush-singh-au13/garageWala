const vehicleTypeDataFromDB = require('./vehicleTypeDataFromDB');

module.exports = {
    isUserNameOrEmailAlreadyExists: require('./isUserNameOrEmailAlreadyExists'),
    isValidPassword: require('./isValidPassword'),
    getUserDetailsFromDB : require('./getUserDetailsFromDB'),
    checkAdmin: require('./checkAdmin'),
    vehicleTypeDataFromDB: require('./vehicleTypeDataFromDB'),
    bookingDetailsFromDB : require('./bookingDetailsFromDB'),
    getPartnerDataFromDB : require('./getPartnerDataFromDB')
}