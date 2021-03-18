require("dotenv").config({ path: "../.env" });
const axios = require("axios");
const FormData = require("form-data");
const { goodlifeUrl } = require("../constants");

const verifyLoginCredentials = async (username, password) => {
  const loginFormData = new FormData();
  const url =
    goodlifeUrl +
    "content/experience-fragments/goodlife/header/master/jcr:content/root/responsivegrid/header.AuthenticateMember.json";
  loginFormData.append("login", username);
  loginFormData.append("passwordParameter", password);

  return await axios({
    method: "post",
    url: process.env.PROXY || url,
    data: loginFormData,
    headers: {
      Authorization: process.env.PROXY_AUTH || "",
      "content-type": `multipart/form-data; boundary=${loginFormData._boundary}`,
    },
  }).catch((err) => {
    return err.response;
  });
};

module.exports = {
  verifyLoginCredentials,
};
