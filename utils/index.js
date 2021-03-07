const { bookWorkout } = require("./bookWorkout");
const { checkIfZeroNeeded } = require("./checkIfZeroNeeded");
const { getBookingList } = require("./getBookingList");
const { getBookingTimes } = require("./getBookingTimes");
const { getCookies } = require("./getCookies");
const { getTimeSlotId } = require("./getTimeSlotId");
const { verifyLoginCredentials } = require("./verifyLoginCredentials");
const { verifySubStatus } = require("./verifySubStatus");

module.exports = {
  bookWorkout,
  checkIfZeroNeeded,
  getBookingList,
  getBookingTimes,
  getCookies,
  getTimeSlotId,
  verifyLoginCredentials,
  verifySubStatus,
};
