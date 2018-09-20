"use strict";
var express = require("express");
const nodemailer = require("nodemailer");

let globalTransporter = {
  host: "", //SERVIDOR DE SALIDA EJ.: server.macherit.tk
  port: 465,
  secure: true,
  auth: {
    user: "", //MAIL CARRIER EJ.: no-reply@pablopan.com
    pass: process.env.MAIL_PASS
  }
};

module.exports = (email, token, callback) => {
  const template = require("./templates/mpc");
  nodemailer.createTestAccount((err, account) => {
    let transporter = nodemailer.createTransport(globalTransporter);

    let noErrors = true;

    transporter.sendMail(
      {
        from: "no-reply@pablopan.com",
        to: email,
        subject: "Contacto desde pablopan",
        text: template.usuario.text(token),
        html: template.usuario.html(token)
      },
      callback
    );
  });
};
