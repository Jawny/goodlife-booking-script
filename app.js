const mongoose = require("mongoose");
const moment = require("moment");
const cron = require("node-cron");
const express = require("express");
const Cryptr = require("cryptr");
require("moment-timezone");
require("dotenv").config();
const { GoodlifeAutoBook } = require("./index");
const { provinceTimeslotsArr, timezoneCheck } = require("./constants");
const { preBookPrep } = require("./preBookPrep");
const cryptr = new Cryptr(process.env.CRYPTR_KEY);
const userDataSchema = new mongoose.Schema({
  email: String,
  password: String,
  province: String,
  clubId: Number,
  monday: Number,
  tuesday: Number,
  wednesday: Number,
  thursday: Number,
  friday: Number,
  saturday: Number,
  sunday: Number,
});
mongoose.connect(
  `mongodb+srv://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASSWORD}@cluster0.kqhf8.mongodb.net/goodlife?retryWrites=true&w=majority`,
  { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false }
);

const server = () => {
  app = express();
  run();
  // run("est");
  // cron.schedule("0 0 * * *", () => {
  //   run("pst");
  // });

  // cron.schedule("2 21 * * *", () => {
  //   run("est");
  // });

  // cron.schedule("*/2 * * * *", () => {
  //   run("pst");
  // });

  // cron.schedule("*/3 * * * *", () => {
  //   run("est");
  // });

  console.log("server started");
  app.listen(8080);
};

const run = async () => {
  const poo = await preBookPrep(userDataSchema);
  setTimeout(function () {
    console.log("pee", poo);
  }, 10000);
  return;
  const userTable = mongoose.model("userdatas", userDataSchema);
  await userTable.find({}, async (err, collection) => {
    for (const index in collection) {
      const currCollection = collection[index];
      const userProvince = currCollection["province"];
      // Skip user if in the wrong timezone
      if (!timezoneCheck[timezone].includes(userProvince.toUpperCase())) {
        console.log("Different timezone");
        continue;
      }
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

      // console.log(collection);
      // date formatting
      const currentDate = moment().tz("America/Los_Angeles");
      const bookDate =
        timezone === "est"
          ? moment(currentDate, "YYYY-MM-DD").add(7, "days")
          : moment(currentDate, "YYYY-MM-DD").add(6, "days");
      const bookDay = bookDate.format("D");
      const bookMonth = bookDate.format("M");
      const bookYear = bookDate.format("YYYY");
      const currWeekday = bookDate.isoWeekday(); // 1 = monday 1-7
      // console.log("currWeekday:", currWeekday);

      // Find correct hour to book
      const userHourInt = weekdays[currWeekday];
      const provinceTimeSlots = provinceTimeslotsArr.find(
        (province) =>
          province.province.toLowerCase() === userProvince.toLowerCase()
      );
      // console.log("provinceTimeSlots", provinceTimeSlots);
      const userHourToBook = provinceTimeSlots.hourIntToString[userHourInt];
      // console.log("userProvince", userProvince);
      // console.log("userHourInt:", userHourInt);
      // console.log("userHourTobook:", userHourToBook);

      const loginResult = await CheckLoginCredentials(userEmail, userPassword);

      // Delete any invalid logins in database
      if (loginResult.toString()[0] !== "2") {
        console.log("deleting invalid data");
        await userTable.deleteOne({ email: userEmail, password: userPassword });
        continue;
      }
      console.log(
        `going to book for ${bookYear}-${bookMonth}-${bookDay} at ${userHourToBook} in ${userProvince}`
      );
      await GoodlifeAutoBook(
        userEmail,
        userPassword,
        bookYear,
        bookMonth,
        bookDay,
        userHourToBook,
        clubId
      );
    }
  });
};

server();
