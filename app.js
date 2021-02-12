const mongoose = require("mongoose");
const moment = require("moment");
const cron = require("node-cron");
const express = require("express");
const Cryptr = require("cryptr");
require("moment-timezone");
require("dotenv").config();
const { CheckLoginCredentials } = require("./CheckLoginCredentials");
const { GoodlifeAutoBook } = require("./index");

const cryptr = new Cryptr(process.env.CRYPTR_KEY);

const server = () => {
  app = express();
  // cron.schedule("0 0 * * *", () => {
  run();
  //  });
  console.log("server started");
  app.listen(8080);
};

const run = async () => {
  mongoose.connect(
    `mongodb+srv://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASSWORD}@cluster0.kqhf8.mongodb.net/goodlife?retryWrites=true&w=majority`,
    { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false }
  );

  const userDataSchema = new mongoose.Schema({
    email: String,
    password: String,
    clubId: Number,
    monday: Number,
    tuesday: Number,
    wednesday: Number,
    thursday: Number,
    friday: Number,
    saturday: Number,
    sunday: Number,
  });

  const userTable = mongoose.model("userdatas", userDataSchema);
  await userTable.find({}, async (err, collection) => {
    for (const index in collection) {
      const currCollection = collection[index];
      const userEmail = currCollection["email"];
      const clubId = currCollection["clubId"];
      const userPassword = cryptr.decrypt(currCollection["password"]);
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

      // const hourIntToString = {
      //   null: null,
      //   0: null,
      //   1: "06:00AM",
      //   2: "07:15AM",
      //   3: "08:30AM",
      //   4: "09:45AM",
      //   5: "11:00AM",
      //   6: "12:15PM",
      //   7: "01:30PM",
      //   8: "02:45PM",
      //   9: "04:00PM",
      //   10: "05:15PM",
      //   11: "06:30PM",
      //   12: "07:45PM",
      //   13: "09:00PM",
      //   14: "10:15PM",
      //   15: "11:15PM",
      //   16: "07:00AM",
      //   17: "08:15AM",
      //   18: "09:30AM",
      //   19: "10:45AM",
      //   20: "12:00PM",
      //   21: "01:15PM",
      //   22: "02:30PM",
      //   23: "03:45PM",
      //   24: "05:00PM",
      //   25: "06:15PM",
      // };

      const hourIntToString = {
        null: null,
        0: null,
        1: null,
        2: null,
        3: null,
        4: null,
        5: null,
        6: null,
        7: null,
        8: null,
        9: null,
        10: "05:00PM", // only valid
        11: "06:15PM", // only valid
        12: "07:30PM", // only valid
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
      };

      // console.log(collection);
      // date formatting
      const currentDate = moment().tz("America/Los_Angeles");
      const bookDate = moment(currentDate, "YYYY-MM-DD").add(7, "days");
      const bookDay = bookDate.format("D");
      const bookMonth = bookDate.format("M");
      const bookYear = bookDate.format("YYYY");
      const currWeekday = bookDate.isoWeekday(); // 1 = monday 1-7
      console.log("currWeekday:", currWeekday);

      // Find correct hour to book
      const userHourInt = weekdays[currWeekday];
      const userHourToBook = hourIntToString[userHourInt];
      console.log("userHourInt:", userHourInt);
      console.log("userHourTobook:", userHourToBook);

      const loginResult = await CheckLoginCredentials(userEmail, userPassword);

      // Delete any invalid logins in database
      if (loginResult.toString()[0] !== "2") {
        console.log("deleting invalid data");
        await userTable.deleteOne({ email: userEmail, password: userPassword });
        continue;
      }
      //   console.log(userHour);
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
