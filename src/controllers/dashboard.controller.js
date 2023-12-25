const services = require("./../services/dashboard");
const httpStatus = require("http-status");
const message = require("./../../responses/user");

exports.dashboardDetails = async (req, res) => {
  try {
    console.log("get the dashboard details");
    let result = [];
    const userCount = await services.getUserCount();
    const salespersonCount = await services.getSalespersonCount();
    const bookingsCount = await services.getBookingsCount();
    const overrideCount = await services.getOverrideCount();
    const goaxledCount = await services.getGoaxledCount();
    const modalCount = await services.getModalCount();
    const partnerCount = await services.getPartnerCount();

    result.push({
      userCount: userCount,
      salespersonCount: salespersonCount,
      bookingsCount : bookingsCount ? bookingsCount : 0,
      overrideCount : overrideCount ? overrideCount : 0,
      goaxledCount : goaxledCount ? goaxledCount : 0,
      modalCount : modalCount ? modalCount : 0,
      partnerCount: partnerCount ? partnerCount : 0
    });

    return res.status(httpStatus.OK).send({
      status: httpStatus.OK,
      message: message.dashboardlistfetchsuccessfully,
      data: result,
    });
  } catch (err) {
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).send({
      status: httpStatus.INTERNAL_SERVER_ERROR,
      message: httpStatus["500_NAME"],
    });
  }
};
