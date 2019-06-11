module.exports = {
  usuario: {
    text: token =>
      `Ha solicitado la creación de una cuenta en fiblo, para continuar haga click aquí:\nhttp://fiblo.com.ar/usuarios/activate?token=${token}.\nAtte. fiblo.`,
    html: token =>
      `Ha solicitado la creación de una cuenta en fiblo, para continuar haga click aquí:<br /><a href='http://fiblo.com.ar/usuarios/activate?token=${token}' style='padding: 10px; background-color: rgb(10, 163, 238); color: #fff; text-decoration: none;border-radius: 5px;margin-top: 10px;margin-bottom: 10px;display:block;width: 100px; text-align: center;'>Continuar</a><span style='font-size: 13px;font-style: italic;display:block;'>Si no visualiza el enlace correctamente, ingrese aquí: http://fiblo.com.ar/usuarios/activate?token=${token}</span><br />Atte. fiblo.`
  }
};
