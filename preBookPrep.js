require("dotenv").config();
require("moment-timezone");
const mongoose = require("mongoose");
const { isEmpty, isNil } = require("lodash");
const moment = require("moment");
const Cryptr = require("cryptr");
const { provinceTimeslotsArr, timezoneCheck, keys } = require("./constants");
const {
  checkIfZeroNeeded,
  verifyLoginCredentials,
  verifySubStatus,
  getCookies,
  getTimeSlotId,
  getBookingList,
  getBookingTimes,
} = require("./utils/index");

const cryptr = new Cryptr(process.env.CRYPTR_KEY);

const preBookPrep = async (schema) => {
  const userTable = mongoose.model("userdatas", schema);
  const usersToBook = keys.reduce((acc, curr) => ((acc[curr] = []), acc), {});

  await userTable.find({}, async (err, collection) => {
    for (const index in collection) {
      const currCollectionRaw = collection[index];
      const currCollection = JSON.parse(JSON.stringify(currCollectionRaw));
      const paymentObject = currCollection["payment"];

      if (isEmpty(paymentObject)) {
        console.log("empty 1", paymentObject);
        continue;
      }
      // filter out users who have no payments
      if (isEmpty(JSON.parse(JSON.stringify(paymentObject)))) {
        console.log("empty 2");
        continue;
      }

      // filter out users with no subId
      const subId = paymentObject["subId"];
      if (isNil(subId)) {
        console.log("no sub id");
        continue;
      }

      // If subscription is not active then skip
      const verifyStatus = await verifySubStatus(subId);
      if (!verifyStatus) {
        console.log("unverified");
        continue;
      }

      // filter out users without a goodlife schedule setup
      const goodlifeObject = currCollection["goodlife"];
      if (isEmpty(goodlifeObject)) {
        continue;
      }

      if (isEmpty(JSON.parse(JSON.stringify(goodlifeObject)))) {
        continue;
      }
      const userProvince = goodlifeObject["province"];
      const userEmail = goodlifeObject["email"];
      const userPassword = cryptr.decrypt(goodlifeObject["password"]);
      const clubId = goodlifeObject["clubId"];
      const userMonday = goodlifeObject["monday"];
      const userTuesday = goodlifeObject["tuesday"];
      const userWednesday = goodlifeObject["wednesday"];
      const userThursday = goodlifeObject["thursday"];
      const userFriday = goodlifeObject["friday"];
      const userSaturday = goodlifeObject["saturday"];
      const userSunday = goodlifeObject["sunday"];
      const weekdays = {
        1: userMonday,
        2: userTuesday,
        3: userWednesday,
        4: userThursday,
        5: userFriday,
        6: userSaturday,
        7: userSunday,
      };

      // Verify that the current user in collection should be booked at this time.
      // if (!timezoneCheck[timezone].includes(userProvince)) {
      //   console.log("User is in a different timezone");
      //   continue;
      // }

      // Format dates
      const currentDate = moment().tz("America/Los_Angeles");
      // TODO CONVERT ALL MOMENTS TO ACCEPT A OFFSET TO NOT NEED TERNARY STATEMENTS
      const bookDate = moment(currentDate, "YYYY-MM-DD").add(
        userProvince.toLowerCase() === "on" ? 3 : 3,
        "days"
      );
      // const bookDate = moment("2021-03-08", "YYYY-MM-DD");
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

      // Check if login was successful and create object with cookies, timeSlot and clubId.
      if (loginResult.status === 200) {
        const cookies = await getCookies(loginResult);
        const userhour = userHourToBook.toLowerCase();
        const headers = { headers: { cookie: cookies } };

        // Get all available timeslots for specified day
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

        // Get the timeslots for the specified booking day
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

        let timeSlot = await getTimeSlotId(bookingTimes, userhour);

        if (clubId === 128) {
          timeSlot = await getTimeSlotId(bookingTimes, userhour, "for women");
        }

        const userToBook = {
          cookies,
          timeSlot,
          clubId,
          userhour,
          userProvince,
        };
        let normalizedUserHour = userhour.toUpperCase();
        if (userProvince.toLowerCase() === "on") {
          normalizedUserHour = moment(userhour, "hh:mmA")
            .subtract(3, "hours")
            .format("hh:mmA");
        }

        console.log("key", normalizedUserHour, "province:", userProvince);
        usersToBook[normalizedUserHour].push(userToBook);
      }
    }
  });
  return usersToBook;
};

module.exports = { preBookPrep };
