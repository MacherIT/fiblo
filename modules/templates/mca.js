module.exports = {
  usuario: {
    text: token =>
      `Ha solicitado la creación de una cuenta en pablopan, para continuar haga click aquí:\nhttps://pablopan.com/bo/#/usuarios/activate/${token}.\nAtte. pablopan.`,
    html: token =>
      `Ha solicitado la creación de una cuenta en pablopan, para continuar haga click aquí:<br /><a href='https://pablopan.com/bo/#/usuarios/activate/${token}' style='padding: 10px; background-color: rgb(10, 163, 238); color: #fff; text-decoration: none;border-radius: 5px;margin-top: 10px;margin-bottom: 10px;display:block;width: 100px; text-align: center;'>Continuar</a><span style='font-size: 13px;font-style: italic;display:block;'>Si no visualiza el enlace correctamente, ingrese aquí: https://pablopan.com/bo/#/usuarios/activate/${token}</span><br />Atte. pablopan.`
  }
};
