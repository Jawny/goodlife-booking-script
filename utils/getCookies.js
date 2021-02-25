const getCookies = async (loginResponse) => {
  let cookies = [];
  loginResponse.headers["set-cookie"].map((cookie) => {
    cookies = cookies + cookie.split(";")[0] + "; ";
  });

  return cookies;
};

module.exports = {
  getCookies,
};
