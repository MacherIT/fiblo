module.exports = {
  usuario: {
    text: token =>
      `Ha solicitado un cambio de contraseña para su cuenta de Fiblo, para continuar haga click aquí:\nhttp://fiblo.com.com/usuarios/chpw?token=${token}.\nAtte. Fiblo.`,
    html: token =>
      `Ha solicitado un cambio de contraseña para su cuenta de Fiblo, para continuar haga click aquí:<br /><a href='http://fiblo.com.com/usuarios/chpw?token=${token}' style='padding: 10px; background-color: rgb(10, 163, 238); color: #fff; text-decoration: none;border-radius: 5px;margin-top: 10px;margin-bottom: 10px;display:block;width: 100px; text-align: center;'>Continuar</a><span style='font-size: 13px;font-style: italic;display:block;'>Si no visualiza el enlace correctamente, ingrese aquí: http://fiblo.com.com/usuarios/chpw?token=${token}</span><br />Atte. Fiblo.`
  }
};
