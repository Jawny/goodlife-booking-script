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

const server = () => {
  app = express();

  let prePrepArray;
  let filteredPrePrepArray;
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

  // Login and generate array of users our users at 9am utc or 4am est (arbitrary time)
  cron.schedule("0 9 * * *", () => {
    prePrepArray = preBookPrep(userDataSchema);
  });

  // Run every 13 minutes after 10am utc or 5am est
  cron.schedule("*/13 10 * * *", async () => {
    filteredPrePrepArray = await filterPreBookPrep(prePrepArray);
    // await mongoose.disconnect();
  });

  // Run every 15 minutes after 10am utc or 5am est
  cron.schedule("*/15 10 * * *", async () => {
    await bookUsers(filteredPrePrepArray);
    // await mongoose.disconnect();
  });

  console.log(`server started on port ${PORT}`);
  app.listen(PORT);
};

server();
