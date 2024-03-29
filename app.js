require("dotenv").config();
const mongoose = require("mongoose");
const moment = require("moment");
const cron = require("node-cron");
const express = require("express");
const { preBookPrep } = require("./preBookPrep");
const { bookUsers } = require("./bookUsers");
const { filterPreBookPrep } = require("./filterPreBookPrep");

const PORT = process.env.PORT || 8080;
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

const server = async () => {
  const app = express();

  let preppedObj = await preBookPrep(userDataSchema);
  // const test = [
  //   {
  //     cookie: "cookie",
  //     timeSlot: "123",
  //     clubId: "1231",
  //     userhour: "01:15am",
  //     userProvince: "BC",
  //   },
  // ];
  // filterPreBookPrep(test, moment());
  // setTimeout(function () {
  //   // console.log(preppedObj);
  //   const currTime = moment().tz("America/Los_Angeles").format("hh:mmA");
  //   console.log(
  //     `Booking at ${currTime} for ${preppedObj["06:00AM"].length} users`
  //   );
  // }, 10000);

  // Login and generate array of users every 12th min of every hour
  // cron.schedule(
  //   "12 0-23 * * *",
  //   async () => {
  //     console.log("preparing data");
  //     preppedObj = await preBookPrep(userDataSchema);
  //   },
  //   { timezone: "America/Los_Angeles" }
  // );

  // Run every hour
  cron.schedule(
    "55 0-23 * * *",
    async () => {
      const currTime = moment().tz("America/Los_Angeles");
      console.log("preparing data");
      preppedObj = await preBookPrep(userDataSchema, currTime);
    },
    { timezone: "America/Los_Angeles" }
  );

  cron.schedule(
    "0 1-23 * * *",
    async () => {
      const currTime = moment().tz("America/Los_Angeles").format("hh:mmA");
      console.log(
        `Booking at ${currTime} for ${preppedObj[currTime].length} users`
      );
      await bookUsers(preppedObj[currTime]);
      // await mongoose.disconnect();
    },
    { timezone: "America/Los_Angeles" }
  );

  // Run every 15 minutes after every hour
  cron.schedule(
    "10 0-23 * * *",
    async () => {
      console.log("preparing data");
      const currTime = moment().tz("America/Los_Angeles");
      preppedObj = await preBookPrep(userDataSchema, currTime);
    },
    { timezone: "America/Los_Angeles" }
  );

  cron.schedule(
    "15 1-23 * * *",
    async () => {
      const currTime = moment().tz("America/Los_Angeles").format("hh:mmA");
      console.log(
        `Booking at ${currTime} for ${preppedObj[currTime].length} users`
      );
      await bookUsers(preppedObj[currTime]);
      // await mongoose.disconnect();
    },
    { timezone: "America/Los_Angeles" }
  );

  // Run every 30 minutes after every hour
  cron.schedule(
    "25 0-23 * * *",
    async () => {
      const currTime = moment().tz("America/Los_Angeles");
      console.log("preparing data");
      preppedObj = await preBookPrep(userDataSchema, currTime);
    },
    { timezone: "America/Los_Angeles" }
  );

  cron.schedule(
    "30 1-23 * * *",
    async () => {
      const currTime = moment().tz("America/Los_Angeles").format("hh:mmA");
      console.log(
        `Booking at ${currTime} for ${preppedObj[currTime].length} users`
      );
      await bookUsers(preppedObj[currTime]);
      // await mongoose.disconnect();
    },
    { timezone: "America/Los_Angeles" }
  );

  // Run every 45 minutes after every hour
  cron.schedule(
    "40 0-23 * * *",
    async () => {
      const currTime = moment().tz("America/Los_Angeles");
      console.log("preparing data");
      preppedObj = await preBookPrep(userDataSchema, currTime);
    },
    { timezone: "America/Los_Angeles" }
  );

  cron.schedule(
    "45 1-23 * * *",
    async () => {
      const currTime = moment().tz("America/Los_Angeles").format("hh:mmA");
      console.log(
        `Booking at ${currTime} for ${preppedObj[currTime].length} users`
      );
      await bookUsers(preppedObj[currTime]);
      // await mongoose.disconnect();
    },
    { timezone: "America/Los_Angeles" }
  );
  console.log(`server started on port ${PORT}`);
  app.listen(PORT);
};

server();
