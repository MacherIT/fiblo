"use strict";
var express = require("express");
var router = express.Router();
const nodemailer = require("nodemailer");

let globalTransporter = {
  service: "gmail",
  auth: {
    user: "fiblo.dev@gmail.com",
    pass: "Accion2019"
  },
  secure: true
};

router.post("/contacto", (req, res) => {
  return res.status(500).json();
  // const template = require("./templates/contacto");
  // if (req.body.email)
  //   nodemailer.createTestAccount((err, account) => {
  //     let transporter = nodemailer.createTransport(globalTransporter);

  //     let noErrors = true;

  //     transporter.sendMail(
  //       {
  //         from: "fiblo.dev@gmail.com",
  //         to: req.body.email,
  //         subject: "Contacto desde Fiblo",
  //         text: template.usuario.text(req),
  //         html: template.usuario.html(req)
  //       },
  //       (error, info) => {
  //         if (error) noErrors = false;
  //       }
  //     );
  //     if (noErrors)
  //       transporter.sendMail(
  //         {
  //           from: "fiblo.dev@gmail.com",
  //           to: "info@pablopan.com",
  //           subject: "Contacto desde Fiblo",
  //           text: template.cliente.text(req),
  //           html: template.cliente.html(req)
  //         },
  //         (error, info) => {
  //           if (error) res.status(500).json({ message: "Ocurrió un error" });
  //           else res.json();
  //         }
  //       );
  //     else return res.status(500).json({ message: "Ocurrió un error" });
  //   });
  // else return res.status(500).json({ message: "Datos incompletos" });
});

module.exports = router;
