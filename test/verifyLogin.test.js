const { verifyLoginCredentials } = require("../utils/index.js");
const EMAIL = "";
const PASSWORD = "";

const testLogin = async () => {
  const loginResponse = await verifyLoginCredentials(EMAIL, PASSWORD);
  console.log("login response:", loginResponse);
};

testLogin();
