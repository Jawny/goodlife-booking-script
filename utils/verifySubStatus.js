const axios = require("axios");
require("dotenv").config();

const verifySubStatus = async (subscriptionId) => {
  const response = await axios.post(
    `${process.env.DOMAIN}/payments/get-subscription-status`,
    { subscriptionId }
  );

  return response.data === "active";
};

module.exports = {
  verifySubStatus,
};
