require("dotenv").config();
const mongoose = require("mongoose");
const moment = require("moment");
const Cryptr = require("cryptr");
const { provinceTimeslotsArr } = require("./constants");
const {
  checkIfZeroNeeded,
  verifyLoginCredentials,
  getCookies,
  getTimeSlotId,
  getBookingList,
  getBookingTimes,
} = require("./utils/index");

const cryptr = new Cryptr(process.env.CRYPTR_KEY);

const preBookPrep = async (schema) => {
  const userTable = mongoose.model("userdatas", schema);
  let usersToBook = [];

  await userTable.find({}, async (err, collection) => {
    for (const index in collection) {
      const currCollection = collection[index];
      const userProvince = currCollection["province"];
      const userEmail = currCollection["email"];
      const userPassword = cryptr.decrypt(currCollection["password"]);
      const clubId = currCollection["clubId"];
      const userMonday = currCollection["monday"];
      const userTuesday = currCollection["tuesday"];
      const userWednesday = currCollection["wednesday"];
      const userThursday = currCollection["thursday"];
      const userFriday = currCollection["friday"];
      const userSaturday = currCollection["saturday"];
      const userSunday = currCollection["sunday"];
      const weekdays = {
        1: userMonday,
        2: userTuesday,
        3: userWednesday,
        4: userThursday,
        5: userFriday,
        6: userSaturday,
        7: userSunday,
      };

      // Format dates
      const currentDate = moment().tz("America/Los_Angeles");
      const bookDate = moment(currentDate, "YYYY-MM-DD").add(7, "days");
      const bookDay = checkIfZeroNeeded(bookDate.format("D"));
      const bookMonth = checkIfZeroNeeded(bookDate.format("M"));
      const bookYear = bookDate.format("YYYY");
      const currWeekday = bookDate.isoWeekday(); // 1 = monday 1-7

      // Find correct hour to book
      const userHourInt = weekdays[currWeekday];
      const provinceTimeSlots = provinceTimeslotsArr.find(
        (province) =>
          province.province.toLowerCase() === userProvince.toLowerCase()
      );
      const userHourToBook = provinceTimeSlots.hourIntToString[userHourInt];

      if (userHourToBook === null) {
        console.log("user did not want to book");
        continue;
      }

      const loginResult = await verifyLoginCredentials(userEmail, userPassword);
      console.log("login status", loginResult.status);

      // TODO Add Delete any invalid logins in database. Had a random instance of delete for unknown reasons
      //   if (loginResult.status !== 200) {
      //     console.log("deleting invalid data");
      //     await userTable.deleteOne({ email: userEmail, password: userPassword });
      //     continue;
      //   }

      if (loginResult.status === 200) {
        const cookies = await getCookies(loginResult);
        const userhour = userHourToBook.toLowerCase();
        const headers = { headers: { cookie: cookies } };
        const bookingList = await getBookingList(
          clubId,
          bookYear,
          bookMonth,
          bookDay,
          headers
        );

        if (!Array.isArray(bookingList)) {
          console.log("failed to get booking list");
          continue;
        }

        const bookingTimes = await getBookingTimes(
          bookingList,
          bookYear,
          bookMonth,
          bookDay
        );

        if (bookingTimes === null) {
          console.log("Goodlife booking time could not be found");
          continue;
        }

        const timeSlot = await getTimeSlotId(bookingTimes, userhour);

        const userToBook = { cookies, timeSlot, clubId };
        usersToBook.push(userToBook);
      }
    }
  });

  return usersToBook;
};

module.exports = { preBookPrep };
