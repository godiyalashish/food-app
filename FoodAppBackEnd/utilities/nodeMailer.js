"use strict";
const nodemailer = require("nodemailer");
const password = require('./secrets');

// async..await is not allowed in global scope, must use a wrapper
async function mailSender(email,otp) {
  let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: "ashishgodiyal.333@gmail.com", // generated ethereal user
      pass: password, // generated ethereal password
    },
  });

  let info = await transporter.sendMail({
    from: '"Food App 👻" <foodApp@example.com>', // sender address
    to: email, // list of receivers
    subject: "Resetting password request", // Subject line
    text: `Your password resetting otp is ${password}`, // plain text body
    html: `OTP ${otp}`, // html body
  });

  console.log("Message sent: %s", info.messageId);
  console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
}

module.exports = mailSender
