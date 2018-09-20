module.exports = {
  cliente: (usuario, presupuesto) =>
    `Se ha emitido una solicitud de presupuesto desde el sitio web:<br /><br />- Usuario: ${
      usuario.nombre
    }<br />- Email: ${
      usuario.email
    }<br />- Link: https://pablopan.com/#/bo/presupuestos/${
      presupuesto._id
    }<br />- Productos:${presupuesto.productos.map(
      producto =>
        "<br /><br />---- Nombre: " +
        producto.nombre +
        "<br />---- Cantidad: " +
        producto.cantidad
    )}`,
  usuario: (presupuesto, valorDolar) =>
    `Ha habido una actualización en el presupuesto solicitado a Pablo Pan:<br /><br />El estado del presupuesto es:<br />- Estado: ${presupuesto.estado.toUpperCase()}<br />- Productos:${presupuesto.productos.map(
      producto =>
        "<br /><br />---- Nombre: " +
        producto.nombre +
        "<br />---- Cantidad: " +
        producto.cantidad +
        "<br />---- Precio por unidad: $" +
        producto.precio * valorDolar +
        "<br />---- Mínimo de días de entrega: " +
        producto.tiempoEntrega +
        " días"
    )}`
};
