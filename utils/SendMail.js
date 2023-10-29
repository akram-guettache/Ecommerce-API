const nodemailer = require("nodemailer");
const config = require("./NodeMailerCf");
const sendEmail = async ({ to, subject, html }) => {
  const transporter = nodemailer.createTransport(config);
  return transporter.sendMail({
    from: "'Akram AKA SerbaSsi' <akramgtch@gmail.com>",
    to,
    subject,
    html,
  });
};
module.exports = sendEmail;
