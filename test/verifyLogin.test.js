const { verifyLoginCredentials } = require("../utils/index.js");
const EMAIL = "johnnyliao06@gmail.com";
const PASSWORD = "Goodlifeautobook123!";

const testLogin = async () => {
  const loginResponse = await verifyLoginCredentials(EMAIL, PASSWORD);
  console.log("login response:", loginResponse);
};

testLogin();
