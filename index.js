const axios = require("axios");
const moment = require("moment");
const FormData = require("form-data");

const GOODLIFE_URL = "https://www.goodlifefitness.com/";

const login = async (username, password, retries = 0) => {
  const loginFormData = new FormData();
  loginFormData.append("login", username);
  loginFormData.append("passwordParameter", password);

  return await axios({
    method: "post",
    url:
      GOODLIFE_URL +
      "content/experience-fragments/goodlife/header/master/jcr:content/root/responsivegrid/header.AuthenticateMember.json",
    data: loginFormData,
    headers: {
      "content-type": `multipart/form-data; boundary=${loginFormData._boundary}`,
    },
  }).catch((err) => {
    if (retries <= 3) {
      console.log(`Failed to login for ${username} on retry ${retries}`);
      setTimeout(login, 10000, username, password, retries + 1);
    }
  });
};

const checkIfZeroNeeded = (day) => {
  if (day.length == 1) {
    const dayToString = day.toString();
    const addZeroToFront = "0" + dayToString;
    return addZeroToFront;
  } else {
    return day;
  }
};

const getCookies = async (loginResponse) => {
  let cookies = [];
  loginResponse.headers["set-cookie"].map((cookie) => {
    cookies = cookies + cookie.split(";")[0] + "; ";
  });
  return cookies;
};

const getBookingTimes = async (bookingListDataResponse, year, month, day) => {
  const formattedDay = checkIfZeroNeeded(day);
  const formattedMonth = checkIfZeroNeeded(month);
  for (const index in bookingListDataResponse) {
    const userDateToBook = year + "-" + formattedMonth + "-" + formattedDay;
    const formattedDateToBook = moment(
      bookingListDataResponse[index]["weekday"]
    ).format("YYYY-MM-DD");
    console.log("formatted date to book:", formattedDateToBook);
    if (formattedDateToBook === userDateToBook) {
      return bookingListDataResponse[index]["workouts"];
    } else {
      return null;
    }
  }
};

const getTimeSlotId = async (bookingTimes, hour) => {
  // console.log("bookingTimes:", bookingTimes);
  for (const index in bookingTimes) {
    const formattedBookingTime = moment(bookingTimes[index]["startAt"])
      .format("hh:mm a")
      .replace(/\s/g, "")
      .toLowerCase();
    // console.log("formatted:", formattedBookingTime);
    const gymArea = bookingTimes[index]["gymArea"].toLowerCase();
    if (formattedBookingTime === hour && gymArea === "gym floor") {
      // console.log("found");
      return bookingTimes[index]["identifier"];
    }
  }
};

const bookWorkout = async (cookies, timeSlotId, clubId, retries = 0) => {
  const bookingDataForm = new FormData();
  bookingDataForm.append("clubId", clubId);
  bookingDataForm.append("timeSlotId", timeSlotId);
  // console.log("boundary", bookingDataForm);
  await axios({
    method: "post",
    url:
      GOODLIFE_URL +
      "content/goodlife/en/book-workout/jcr:content/root/responsivegrid/workoutbooking.CreateWorkoutBooking.json",
    data: bookingDataForm,
    headers: {
      cookie: cookies,
      "content-type": `multipart/form-data; boundary=${bookingDataForm._boundary}`,
    },
  })
    .then(() => {
      console.log("BOOKING SUCCESS");
    })
    .catch((err) => {
      setTimeout(bookWorkout, 10000, cookies, timeSlotId, clubId, retries + 1);
      console.log("BOOKING FAILED");
    });
};

const book = async (cookies, year, month, day, hour, clubId, retries = 0) => {
  const formattedDay = checkIfZeroNeeded(day);
  const formattedMonth = checkIfZeroNeeded(month);
  console.log(clubId);
  //console.log(typeof hour);
  if (hour === null) {
    console.log("user did not want to book this day");
    return;
  }
  const userhour = hour.toLowerCase();
  const headers = { headers: { cookie: cookies } };
  const bookingList = await axios
    .get(
      GOODLIFE_URL +
        `content/goodlife/en/book-workout/jcr:content/root/responsivegrid/workoutbooking.GetWorkoutSlots.${clubId}.${year}-${formattedMonth}-${formattedDay}.json`,
      headers
    )
    .catch((err) => {
      if (retryCount <= 3) {
        setTimeout(
          book,
          10000,
          cookies,
          year,
          month,
          day,
          hour,
          clubId,
          retries + 1
        );
      }
      console.log("err");
    });
  // console.log("bookingList:", bookingList);
  const bookingListDataResponse = await bookingList.data["map"]["response"];
  // console.log("booking List:", bookingListDataResponse);

  // merge all workout arrays into one single array
  const bookingTimes = await getBookingTimes(
    bookingListDataResponse,
    year,
    month,
    day
  );
  // console.log(bookingTimes);

  // ERROR CHECKING: If null then return and stop script since the booking date is not found in goodlife
  if (bookingTimes === null) {
    console.log("Goodlife booking time could not be found");
    return;
  }
  // console.log("booking Times:", bookingTimes);

  const timeSlotId = await getTimeSlotId(bookingTimes, userhour);
  console.log("timeSlotId:", timeSlotId);

  await bookWorkout(cookies, timeSlotId, clubId);
};

const GoodlifeAutoBook = async (
  username,
  password,
  year,
  month,
  day,
  hour,
  clubId
) => {
  const loginToGoodlife = await login(username, password);
  // console.log("login headers:", loginToGoodlife.headers);

  const cookies = await getCookies(loginToGoodlife);
  // console.log("login cookies:", cookies);

  const bookWorkout = await book(cookies, year, month, day, hour, clubId);
  // console.log(bookWorkout);
};

module.exports = {
  GoodlifeAutoBook,
};
