const nodemailer = require("nodemailer");

const mailHelper = async (options) => {
  console.log(options);
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    auth: {
      user: process.env.SMTP_USER, // generated ethereal user
      pass: process.env.SMTP_PASS, // generated ethereal password
    },
  });
  const message = {
    from: "salmankhan", // sender address
    to: options.email,
    subject: options.subject,
    text: options.text,
  };

  // send mail with defined transport object
  await transporter.sendMail(message);
};

module.exports = mailHelper;
