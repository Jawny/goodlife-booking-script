const axios = require("axios");
const FormData = require("form-data");
const { goodlifeUrl } = require("../constants");

const bookWorkout = async (cookies, timeSlotId, clubId, retries = 0) => {
  const bookingDataForm = new FormData();
  bookingDataForm.append("clubId", clubId);
  bookingDataForm.append("timeSlotId", timeSlotId);
  // console.log("boundary", bookingDataForm);
  return await axios({
    method: "post",
    url:
      goodlifeUrl +
      "content/goodlife/en/book-workout/jcr:content/root/responsivegrid/workoutbooking.CreateWorkoutBooking.json",
    data: bookingDataForm,
    headers: {
      cookie: cookies,
      "content-type": `multipart/form-data; boundary=${bookingDataForm._boundary}`,
    },
  }).catch((err) => {
    console.log("booking error", err);
    return err.response;
  });
};

module.exports = {
  bookWorkout,
};
