/*
 * Adding extra null slots because there is a potential edge case where someone inserts their
 * workout times, but then change their club and the timeslot ends up null. I have yet to fix this on server/client side.
 */
const provinceTimeslotsArr = [
  {
    province: "BC",
    hourIntToString: {
      null: null,
      0: null,
      1: "05:00PM", // only valid
      2: "06:15PM", // only valid
      3: "07:30PM", // only valid
      4: null,
      5: null,
      6: null,
      7: null,
      8: null,
      9: null,
      10: null,
      11: null,
      12: null,
      13: null,
      14: null,
      15: null,
      16: null,
      17: null,
      18: null,
      19: null,
      20: null,
      21: null,
      22: null,
      23: null,
      24: null,
      25: null,
    },
  },
  {
    province: "ON",
    hourIntToString: {
      null: null,
      0: null,
      1: "06:00AM",
      2: "07:15AM",
      3: "08:30AM",
      4: "09:45AM",
      5: "11:00AM",
      6: "12:15PM",
      7: "01:30PM",
      8: "02:45PM",
      9: "04:00PM",
      10: "05:15PM",
      11: "06:30PM",
      12: "07:45PM",
      13: "09:00PM",
      14: "10:15PM",
      15: "11:15PM",
      16: "07:00AM",
      17: "08:15AM",
      18: "09:30AM",
      19: "10:45AM",
      20: "12:00PM",
      21: "01:15PM",
      22: "02:30PM",
      23: "03:45PM",
      24: "05:00PM",
      25: "06:15PM",
    },
  },
];

const keys = [
  "02:00AM",
  "02:15AM",
  "02:30AM",
  "02:45AM",
  "03:00AM",
  "03:15AM",
  "03:30AM",
  "03:45AM",
  "04:00AM",
  "04:15AM",
  "04:30AM",
  "04:45AM",
  "05:00AM",
  "05:15AM",
  "05:30AM",
  "05:45AM",
  "06:00AM",
  "06:15AM",
  "06:30AM",
  "06:45AM",
  "07:00AM",
  "07:15AM",
  "07:30AM",
  "07:45AM",
  "08:00AM",
  "08:15AM",
  "08:30AM",
  "08:45AM",
  "09:00AM",
  "09:15AM",
  "09:30AM",
  "09:45AM",
  "10:00AM",
  "10:15AM",
  "10:30AM",
  "10:45AM",
  "11:00AM",
  "11:15AM",
  "11:30AM",
  "11:45AM",
  "12:00PM",
  "12:15PM",
  "12:30PM",
  "12:45PM",
  "01:00PM",
  "01:15PM",
  "01:30PM",
  "01:45PM",
  "02:00PM",
  "02:15PM",
  "02:30PM",
  "02:45PM",
  "03:00PM",
  "03:15PM",
  "03:30PM",
  "03:45PM",
  "04:00PM",
  "04:15PM",
  "04:30PM",
  "04:45PM",
  "05:00PM",
  "05:15PM",
  "05:30PM",
  "05:45PM",
  "06:00PM",
  "06:15PM",
  "06:30PM",
  "06:45PM",
  "07:00PM",
  "07:15PM",
  "07:30PM",
  "07:45PM",
  "08:00PM",
  "08:15PM",
  "08:30PM",
  "08:45PM",
  "09:00PM",
  "09:15PM",
  "09:30PM",
  "09:45PM",
  "10:00PM",
  "10:15PM",
  "10:30PM",
  "10:45PM",
  "11:00PM",
  "11:15PM",
  "11:30PM",
  "11:45PM",
  "12:00AM",
];

const timezoneCheck = { est: ["ON"], pst: ["BC"] };
const goodlifeUrl = "https://www.goodlifefitness.com/";

module.exports = {
  provinceTimeslotsArr,
  timezoneCheck,
  goodlifeUrl,
  keys,
};

// ** OUTDATED  Keeping in case Goodlife Reverts back
// const hourIntToString = {
//   0: null,
//   1: "06:00AM",
//   2: "07:00AM",
//   3: "07:30AM",
//   4: "08:00AM",
//   5: "08:30AM",
//   6: "09:00AM",
//   7: "10:00AM",
//   8: "10:30AM",
//   9: "11:00AM",
//   10: "11:30AM",
//   11: "12:00PM",
//   12: "01:00PM",
//   13: "01:30PM",
//   14: "02:30PM",
//   15: "03:00PM",
//   16: "04:00PM",
//   17: "04:30PM",
//   18: "05:30PM",
//   19: "06:00PM",
//   20: "07:00PM",
//   11: "07:30PM",
//   22: "09:00PM",
//   23: "10:30PM",
// };
