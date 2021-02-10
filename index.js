const axios = require("axios");
const moment = require("moment");
const FormData = require("form-data");
const GOODLIFE_URL = "https://www.goodlifefitness.com/";

const login = async (username, password) => {
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
    // console.log(err);
  });
};

const getCookies = async (loginResponse) => {
  let cookies = [];
  loginResponse.headers["set-cookie"].map((cookie) => {
    cookies = cookies + cookie.split(";")[0] + "; ";
  });
  return cookies;
};

const getBookingTimes = async (bookingListDataResponse, year, month, day) => {
  for (const index in bookingListDataResponse) {
    const userDateToBook = year + "-" + month + "-" + day;
    const formattedDateToBook = moment(
      bookingListDataResponse[index]["weekday"]
    ).format("YYYY-MM-DD");

    if (formattedDateToBook === userDateToBook) {
      return bookingListDataResponse[index]["workouts"];
    } else {
      return null;
    }
  }
};

const getTimeSlotId = async (bookingTimes, hour) => {
  for (const index in bookingTimes) {
    const formattedBookingTime = moment(bookingTimes[index]["startAt"])
      .format("hh:mm a")
      .replace(/\s/g, "")
      .toLowerCase();
    const gymArea = bookingTimes[index]["gymArea"].toLowerCase();

    if (formattedBookingTime === hour && gymArea === "gym floor") {
      return bookingTimes[index]["identifier"];
    }
  }
};

const bookWorkout = async (cookies, timeSlotId) => {
  const bookingDataForm = new FormData();
  bookingDataForm.append("clubId", 243);
  bookingDataForm.append("timeSlotId", timeSlotId);

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
  }).catch((err) => {
    console.log(err);
  });
};

const book = async (cookies, year, month, day, hour) => {
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
        `content/goodlife/en/book-workout/jcr:content/root/responsivegrid/workoutbooking.GetWorkoutSlots.243.${year}-${month}-${day}.json`,
      headers
    )
    .catch((err) => {
      // console.log(err);
    });
  // console.log("bookingList::", bookingList);
  const bookingListDataResponse = bookingList.data["map"]["response"];
  // console.log("booking List:", bookingListDataResponse);

  // merge all workout arrays into one single array
  const bookingTimes = await getBookingTimes(
    bookingListDataResponse,
    year,
    month,
    day
  );
  console.log(bookingTimes);

  // ERROR CHECKING: If null then return and stop script since the booking date is not found in goodlife
  if (bookingTimes === null) {
    console.log("Goodlife booking time could not be found");
    return;
  }
  //console.log("booking Times:", bookingTimes);

  const timeSlotId = await getTimeSlotId(bookingTimes, userhour);
  //console.log("timeSlotId:", timeSlotId);

  await bookWorkout(cookies, timeSlotId);
};

const GoodlifeAutoBook = async (username, password, year, month, day, hour) => {
  const loginToGoodlife = await login(username, password);
  //console.log("login headers:", loginToGoodlife.headers);

  const cookies = await getCookies(loginToGoodlife);
  //console.log("login cookies:", cookies);

  const bookWorkout = await book(cookies, year, month, day, hour);
  //console.log(bookWorkout);
};

module.exports = {
  GoodlifeAutoBook,
};
