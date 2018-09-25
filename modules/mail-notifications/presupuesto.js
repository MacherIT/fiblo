"use strict";
var express = require("express");
const nodemailer = require("nodemailer");
const { stripHtml } = require("../functions");
const configModel = require("../../models/configModel.js");

let globalTransporter = {
  host: "server.macherit.tk", //SERVIDOR DE SALIDA EJ.: server.macherit.tk
  port: 465,
  secure: true,
  auth: {
    user: "no-reply@apdp.com.ar", //MAIL CARRIER EJ.: no-reply@pablopan.com
    pass: process.env.MAIL_PASS
  }
};

module.exports = {
  notifNewPresupuesto: (usuarioSolicita, presupuesto, callback) => {
    const { cliente } = require("./templates/presupuesto");
    nodemailer.createTestAccount((err, account) => {
      let transporter = nodemailer.createTransport(globalTransporter);

      transporter.sendMail(
        {
          from: "no-reply@pablopan.com",
          to: "info@pablopan.com",
          subject: "Solicitud de presupuesto desde pablopan",
          text: stripHtml(cliente(usuarioSolicita, presupuesto), true),
          html: cliente(usuarioSolicita, presupuesto)
        },
        callback
      );
    });
  },
  notifUpdatePresupuesto: (email, presupuesto, callback) => {
    const { usuario } = require("./templates/presupuesto");
    nodemailer.createTestAccount((err, account) => {
      let transporter = nodemailer.createTransport(globalTransporter);

      configModel
        .findOne({})
        .select("valorDolar")
        .exec(function(err, config) {
          if (err) {
            return res.status(500).json({
              message: "Error when getting config.",
              error: err
            });
          }
          if (!config) {
            return res.status(500).json({
              message: "Error when sending email"
            });
          }

          transporter.sendMail(
            {
              from: "no-reply@pablopan.com",
              to: email,
              subject: "Actualización del presupuesto desde pablopan",
              text: stripHtml(usuario(presupuesto, config.valorDolar), true),
              html: usuario(presupuesto, config.valorDolar)
            },
            callback
          );
        });
    });
  }
};
