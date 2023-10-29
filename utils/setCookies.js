const setCookies = (res, token, refreshToken) => {
  const oneDay = 1000 * 60 * 60 * 24;
  res.cookie("AccessToken", token, {
    httpOnly: true,
    expires: new Date(Date.now() + oneDay),
  });
  const longerExp = 1000 * 60 * 60 * 24 * 30;
  res.cookie(
    "RefreshToken",
    { token, refreshToken },
    {
      expiresIn: new Date(Date.now() + longerExp),
      httpOnly: true,
    }
  );
};
module.exports = setCookies;
