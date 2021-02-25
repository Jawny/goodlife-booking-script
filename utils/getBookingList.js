const axios = require("axios");
const { goodlifeUrl } = require("../constants");

const getBookingList = async (clubId, year, month, day, headers) => {
  const bookingList = await axios
    .get(
      goodlifeUrl +
        `content/goodlife/en/book-workout/jcr:content/root/responsivegrid/workoutbooking.GetWorkoutSlots.${clubId}.${year}-${month}-${day}.json`,
      headers
    )
    .catch((err) => {
      return err.response;
    });
  return bookingList.data["map"]["response"];
};

module.exports = {
  getBookingList,
};
