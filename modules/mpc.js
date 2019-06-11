"use strict";
var express = require("express");
const nodemailer = require("nodemailer");

let globalTransporter = {
  service: "gmail",
  auth: {
    user: "fiblo.dev@gmail.com",
    pass: "Accion2019"
  },
  secure: true
};

module.exports = (email, token, callback) => {
  const template = require("./templates/mpc");
  nodemailer.createTestAccount((err, account) => {
    let transporter = nodemailer.createTransport(globalTransporter);

    let noErrors = true;

    transporter.sendMail(
      {
        from: "fiblo.dev@gmail.com",
        to: email,
        subject: "Contacto desde Fiblo",
        text: template.usuario.text(token),
        html: template.usuario.html(token)
      },
      callback
    );
  });
};
