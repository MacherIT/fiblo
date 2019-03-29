pragma solidity ^0.4.22;

import './StandAlone.sol';

contract Module {

    /* StandAlone public s; */
    address public s_addr;

    function setS(address SAAddress) public {
        /* s = StandAlone(SAAddress); */
        s_addr = SAAddress;
    }

    function get() public view returns(uint) {
        /* return s_addr.call.value(1 ether).gas(10)(abi.encodeWithSignature("get(uint)")); */
        return StandAlone(s_addr).get();
    }

    function set(uint  _x) public returns(bool success) {
        return StandAlone(s_addr).set(_x);
    }
}
