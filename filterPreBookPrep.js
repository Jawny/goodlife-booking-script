const moment = require("moment-timezone");

const filterPreBookPrep = (arr, currTime) => {
  const newBookings = [];
  // Convert current time to UTC
  const currTimeUtc = moment.utc(currTime);
  // Find how many minutes until the nearest 15 minute interval
  // (theoretically it will never round down as this will only be called a few minutes prior to the upper 15 min interval)
  const remainder = 15 - (currTimeUtc.minute() % 15);
  // Add the minutes to the time to get the exact booking time
  const nearestFifteenInterval = currTimeUtc
    .add(remainder, "minutes")
    .format("hh:mm");
  let timezone;
  console.log(currTimeUtc, remainder, nearestFifteenInterval);
  for (const index in arr) {
    const { userhour, userProvince } = arr[index];

    // Check if EST or PST time
    if (userProvince.toLowerCase() === "bc") {
      timezone = "America/Los_Angeles";
    } else {
      timezone = "America/New_York";
    }

    // Convert userHour to correct UTC time
    const userHourToMoment = moment.tz(userhour, "hh:mm A", timezone);
    const userHourTimeOnly = userHourToMoment.utc().format("hh:mm");

    if (nearestFifteenInterval === userHourTimeOnly) {
      console.log(
        "Matched Booking Time",
        nearestFifteenInterval,
        userHourTimeOnly
      );
      newBookings.push(arr[index]);
    }
  }

  return newBookings;
};

module.exports = { filterPreBookPrep };
