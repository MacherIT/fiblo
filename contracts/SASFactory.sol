pragma solidity ^0.4.22;

import './mortal.sol';
import './ContratoSAS.sol';

contract SASFactory is mortal {

  mapping(address => address) contratos;

  function createContrato() public payable returns(address addr) {
    if (contratos[msg.sender] == 0) {
      contratos[msg.sender] = new ContratoSAS();
      return address(contratos[msg.sender]);
    }
    else{
      return 0;
    }
  }

  function getContratoAddress() public view returns(address addr) {
    if (contratos[msg.sender] != 0) {
      return address(contratos[msg.sender]);
    }
    else{
      return 0;
    }
  }

}
