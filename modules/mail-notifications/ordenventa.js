"use strict";
var express = require("express");
const nodemailer = require("nodemailer");
const { stripHtml } = require("../functions");

let globalTransporter = {
  host: "server.macherit.tk", //SERVIDOR DE SALIDA EJ.: server.macherit.tk
  port: 465,
  secure: true,
  auth: {
    user: "no-reply@pablopan.com", //MAIL CARRIER EJ.: no-reply@pablopan.com
    pass: process.env.MAIL_PASS
  }
};

module.exports = {
  notifNewOrdenVenta: (usuarioSolicita, ordenventa, callback) => {
    const { cliente, usuario } = require("./templates/ordenventa");
    nodemailer.createTestAccount((err, account) => {
      let transporter = nodemailer.createTransport(globalTransporter);

      transporter.sendMail(
        {
          from: "no-reply@pablopan.com",
          to: "info@pablopan.com",
          subject: "Emisión de orden de compra desde pablopan",
          text: stripHtml(cliente(usuarioSolicita, ordenventa), true),
          html: cliente(usuarioSolicita, ordenventa)
        },
        callback
      );
    });
  }
};
