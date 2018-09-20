module.exports = {
  usuario: {
    text: token =>
      `Ha solicitado un cambio de contraseña para su cuenta de pablopan, para continuar haga click aquí:\npablopan.com/<URL-DE-RECUPERACION/?token=${token}.\nAtte. pablopan.`,
    html: token =>
      `Ha solicitado un cambio de contraseña para su cuenta de pablopan, para continuar haga click aquí:<br /><a href='pablopan.com/<URL-DE-RECUPERACION/?token=${token}' style='padding: 10px; background-color: rgb(10, 163, 238); color: #fff; text-decoration: none;border-radius: 5px;margin-top: 10px;margin-bottom: 10px;display:block;width: 100px; text-align: center;'>Continuar</a><span style='font-size: 13px;font-style: italic;display:block;'>Si no visualiza el enlace correctamente, ingrese aquí: pablopan.com/<URL-DE-RECUPERACION/?token=${token}</span><br />Atte. pablopan.`
  }
};
