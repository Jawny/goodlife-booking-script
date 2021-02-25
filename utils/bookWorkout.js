const axios = require("axios");
const { goodlifeUrl } = require("../constants");

const bookWorkout = async (cookies, timeSlotId, clubId, retries = 0) => {
  const bookingDataForm = new FormData();
  bookingDataForm.append("clubId", clubId);
  bookingDataForm.append("timeSlotId", timeSlotId);
  // console.log("boundary", bookingDataForm);
  await axios({
    method: "post",
    url:
      goodlifeUrl +
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
      if (retries <= 3) {
        console.log("BOOKING FAILED");
        setTimeout(
          bookWorkout,
          10000,
          cookies,
          timeSlotId,
          clubId,
          retries + 1
        );
      }
    });
};

module.exports = {
  bookWorkout,
};
