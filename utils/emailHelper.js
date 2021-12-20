const nodemailer = require("nodemailer");

const mailHelper = async (options) => {
  console.log(options);
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    headers: {
      "api-key":
        "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",
    },
    auth: {
      user: process.env.SMTP_USER, // generated ethereal user
      pass: process.env.SMTP_PASS, // generated ethereal password
    },
  });
  const message = {
    from: "wishesfromsalman@gmail.com", // sender address
    to: options.email,
    subject: options.subject,
    text: options.text,
  };
  transporter.verify(function (error, success) {
    if (error) {
      console.log(error);
    } else {
      console.log("Server is ready to take our messages");
    }
  });

  // send mail with defined transport object
  await transporter.sendMail(message).then((info) => {
    console.log("Preview URL: " + nodemailer.getTestMessageUrl(info));
  });
};

module.exports = mailHelper;
