const moment = require("moment");

const filterPreBookPrep = (arr, currTime) => {
  const newBookings = [];
  for (const index in arr) {
    const remainder = 15 - (currTime.minute() % 15);
    const nearestFifteenInterval = currTime
      .add(remainder, "minutes")
      .format("hh:mm a");
    const userhour = arr[index]["userhour"];
    const formattedTime = nearestFifteenInterval.replace(/\s/g, "");

    if (formattedTime == userhour) {
      newBookings.push(arr[index]);
    }
  }

  return newBookings;
};

module.exports = { filterPreBookPrep };
