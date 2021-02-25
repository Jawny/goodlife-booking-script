const moment = require("moment");
const { checkIfZeroNeeded } = require("./checkIfZeroNeeded");

const getBookingTimes = async (bookingListDataResponse, year, month, day) => {
  const formattedDay = checkIfZeroNeeded(day);
  const formattedMonth = checkIfZeroNeeded(month);

  for (const index in bookingListDataResponse) {
    const userDateToBook = year + "-" + formattedMonth + "-" + formattedDay;
    const formattedDateToBook = moment(
      bookingListDataResponse[index]["weekday"]
    ).format("YYYY-MM-DD");

    console.log("formatted date to book:", formattedDateToBook);

    if (formattedDateToBook === userDateToBook) {
      return bookingListDataResponse[index]["workouts"];
    } else {
      return null;
    }
  }
};

module.exports = {
  getBookingTimes,
};
