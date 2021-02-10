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

      const hourIntToString = {
        0: null,
        6: "06:00AM",
        7: "07:00AM",
        7.5: "07:30AM",
        8: "08:00AM",
        8.5: "08:30AM",
        9: "09:00AM",
        10: "10:00AM",
        10.5: "10:30AM",
        11: "11:00AM",
        11.5: "11:30AM",
        12: "12:00PM",
        13: "01:00PM",
        13.5: "01:30PM",
        14.5: "02:30PM",
        15: "03:00PM",
        16: "04:00PM",
        16.5: "04:30PM",
        17.5: "05:30PM",
        18: "06:00PM",
        19: "07:00PM",
        19.5: "07:30PM",
        21: "09:00PM",
        22.5: "10:30PM",
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
        userHourToBook
      );
    }
  });
};

server();
