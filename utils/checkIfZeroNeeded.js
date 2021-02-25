const checkIfZeroNeeded = (day) => {
  if (day.length == 1) {
    const dayToString = day.toString();
    const addZeroToFront = "0" + dayToString;
    return addZeroToFront;
  } else {
    return day;
  }
};

module.exports = {
  checkIfZeroNeeded,
};
