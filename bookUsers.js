const { bookWorkout } = "./utils/index.js";

const bookUsers = async (usersArray) => {
  usersArray.forEach(async (user) => {
    const { cookies, timeSlot, clubId } = user;
    const bookWorkoutResponse = await bookWorkout(cookies, timeSlot, clubId);

    if (bookWorkoutResponse.status === 200) {
      console.log("booking success");
    } else {
      console.log(
        `booking failed receieved error code ${bookWorkoutResponse.status}`
      );
    }
  });
};

module.exports = {
  bookUsers,
};
