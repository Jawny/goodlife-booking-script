const moment = require("moment");

const getTimeSlotId = async (bookingTimes, hour, area = "gym floor") => {
  // console.log("bookingTimes:", bookingTimes);
  for (const index in bookingTimes) {
    const formattedBookingTime = moment(bookingTimes[index]["startAt"])
      .format("hh:mm a")
      .replace(/\s/g, "")
      .toLowerCase();
    // console.log("formatted:", formattedBookingTime);
    const gymArea = bookingTimes[index]["gymArea"].toLowerCase();
    if (formattedBookingTime === hour && gymArea === area) {
      // console.log("found");
      return bookingTimes[index]["identifier"];
    }
  }
};

module.exports = {
  getTimeSlotId,
};
