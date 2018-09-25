"use strict";
var express = require("express");
var router = express.Router();
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

router.post("/contacto", (req, res) => {
  const template = require("./templates/contacto");
  if (req.body.email)
    nodemailer.createTestAccount((err, account) => {
      let transporter = nodemailer.createTransport(globalTransporter);

      let noErrors = true;

      transporter.sendMail(
        {
          from: "no-reply@pablopan.com",
          to: req.body.email,
          subject: "Contacto desde pablopan",
          text: template.usuario.text(req),
          html: template.usuario.html(req)
        },
        (error, info) => {
          if (error) noErrors = false;
        }
      );
      if (noErrors)
        transporter.sendMail(
          {
            from: "no-reply@pablopan.com",
            to: "info@pablopan.com",
            subject: "Contacto desde pablopan",
            text: template.cliente.text(req),
            html: template.cliente.html(req)
          },
          (error, info) => {
            if (error) res.status(500).json({ message: "Ocurrió un error" });
            else res.json();
          }
        );
      else return res.status(500).json({ message: "Ocurrió un error" });
    });
  else return res.status(500).json({ message: "Datos incompletos" });
});

module.exports = router;
