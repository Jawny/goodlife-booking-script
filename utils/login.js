const { goodlifeUrl } = "./login.js";
const axios = require("axios");
const FormData = require("form-data");

const login = async (username, password, retries = 0) => {
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
    if (retries <= 3) {
      console.log(`Failed to login for ${username} on retry ${retries}`);
      setTimeout(login, 10000, username, password, retries + 1);
    }
  });
};

module.exports = {
  login,
};
