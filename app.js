require("dotenv").config();
const mongoose = require("mongoose");
const cron = require("node-cron");
const express = require("express");
const { preBookPrep } = require("./preBookPrep");
const { bookUsers } = require("./bookUsers");

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

  let usersToBookArray = [];

  // 11:55PM EST The server is using PST time so account for timezone difference -3 hours
  // Run at 11:55PM EST to build array of users to book
  cron.schedule("50 4 * * *", () => {
    usersToBookArray = preBookPrep(userDataSchema, "est");
  });

  // Run at 12:00AM EST to book all users
  cron.schedule("0 5 * * *", async () => {
    await bookUsers(usersToBookArray);
    // await mongoose.disconnect();
  });

  // TODO FIND A BETTER METHOD FOR THIS TIME ZONE DIFFERENCE
  // Consider using 6 GMT timezones for Canada
  // Run at 11:50PM PST to build array of users to book
  cron.schedule("50 7 * * *", () => {
    usersToBookArray = preBookPrep(userDataSchema, "pst");
  });

  // Run at 12:00AM PST to book all users
  cron.schedule("0 8 * * *", async () => {
    await bookUsers(usersToBookArray);
    // await mongoose.disconnect();
  });

  console.log(`server started on port ${PORT}`);
  app.listen(PORT);
};

server();
