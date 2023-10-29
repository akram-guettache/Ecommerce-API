const sendEmail = require("./SendMail");
const sendResetEmail = async ({ name, email, userId, passtoken, origin }) => {
  const emailverification = `${origin}/api/v1/auth/resetpw/${userId}/${passtoken}`;
  const message = `<p>Please Use The Following Link To Reset Your Password,Note That It Expires In 15 Minutes  : 
  <a href="${emailverification}">Verify Email</a> </p>`;
  return sendEmail({
    to: email,
    subject: "Password Reset",
    html: `<h4> Hello, ${name}</h4>
    ${message}
    `,
  });
};
module.exports = sendResetEmail;
