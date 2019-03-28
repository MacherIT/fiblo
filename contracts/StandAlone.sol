pragma solidity ^0.4.22;

contract StandAlone {
    uint public x = 1;

    function get() public view returns(uint) {
        return x;
    }

    function set(uint _x) public returns(bool success) {
        x = _x;
        return true;
    }

    function getLongWay() public view returns(uint) {
        return get();
    }
}
