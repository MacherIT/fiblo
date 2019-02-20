pragma solidity ^0.4.22;

library SafeMath {
  function add(uint a, uint b) internal pure returns (uint c) {
    c = a + b;
    require(c >= a, 'Result must be greater or equal to original number');
  }
  function sub(uint a, uint b) internal pure returns (uint c) {
    require(b <= a, 'Substractor must be lower or equal to original number');
    c = a - b;
  }
  function mul(uint a, uint b) internal pure returns (uint c) {
    c = a * b;
    require(a == 0 || c / a == b);
  }
  function div(uint a, uint b) internal pure returns (uint c) {
    require(b > 0);
    c = a / b;
  }
}
