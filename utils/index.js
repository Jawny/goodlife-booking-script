const { bookWorkout } = require("./bookWorkout");
const { checkIfZeroNeeded } = require("./checkIfZeroNeeded");
const { getBookingList } = require("./getBookingList");
const { getBookingTimes } = require("./getBookingTimes");
const { getCookies } = require("./getCookies");
const { getTimeSlotId } = require("./getTimeSlotId");
const { login } = require("./login");
const { verifyLoginCredentials } = require("./verifyLoginCredentials");

module.exports = {
  bookWorkout,
  checkIfZeroNeeded,
  getBookingList,
  getBookingTimes,
  getCookies,
  getTimeSlotId,
  login,
  verifyLoginCredentials,
};
