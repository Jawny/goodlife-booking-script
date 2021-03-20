const axios = require("axios");
const FormData = require("form-data");
const { goodlifeUrl } = require("../constants");

const verifyLoginCredentials = async (username, password) => {
  const loginFormData = new FormData();
  loginFormData.append("login", username);
  loginFormData.append("passwordParameter", password);

  return await axios({
    method: "post",
    url:
      goodlifeUrl +
      "content/experience-fragments/goodlife/header/master/jcr:content/root/responsivegrid/header.AuthenticateMember.json",
    data: loginFormData,
    headers: {
      "content-type": `multipart/form-data; boundary=${loginFormData._boundary}`,
    },
  }).catch((err) => {
    console.log("login error:", err);
    return err.response;
  });
};

module.exports = {
  verifyLoginCredentials,
};
