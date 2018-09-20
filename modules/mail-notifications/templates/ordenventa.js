module.exports = {
  cliente: (usuario, ordenventa) => `Se ha emitido una orden de compra desde el sitio web:<br /><br />- Usuario: ${
      usuario.nombre
    }<br />- Email: ${
      usuario.email
    }<br />- Link: https://pablopan.com/#/bo/ordenventas/${
      ordenventa._id
    }<br />- Productos:${ordenventa.productos.map(
      producto =>
        "<br /><br />---- Nombre: " +
        producto.nombre +
        "<br />---- Cantidad: " +
        producto.cantidad
    )}`
};
