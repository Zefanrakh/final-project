const nodemailer = require("nodemailer");
const templateEmail = require("./emailtemplate");

const smtpTransport = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: "smartdaycare.cs@gmail.com",
    pass: "sandisandi",
  },
});

const sendEmail = (toEmail, link) => {
  const mailOptions = {
    from: "smartdaycare.cs@gmail.com",
    to: toEmail,
    subject: "Informasi akses kamera",
    html: templateEmail(link),
  };
  smtpTransport.sendMail(mailOptions, function (error, response) {
    if (error) {
      console.log(error);
    } else {
      console.log(response);
    }
  });
};

module.exports = sendEmail;
