pragma solidity ^0.4.22;

import './mortal.sol';

contract OraculoPrecio is mortal {

  event precioSetted(uint precio_viejo, uint precio);

  uint precio_eth_ars;

  constructor() public {
    precio_eth_ars = 560000;
  }

  function setPrecio(uint precio) onlyowner public {
    emit precioSetted(precio_eth_ars, precio);
    precio_eth_ars = precio;
  }

  function getPrecio() public view returns (uint precio) {
    return precio_eth_ars;
  }

}
