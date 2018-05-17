pragma solidity ^0.4.17;

import './mortal.sol';

contract ContratoSAS is mortal {
    /* Events */
    event contributionReceived(address indexed from, uint256 indexed uid, uint256 amount);
    event receivedFunds(address _from, uint256 _amount);

    struct Contribution {
        address _from;
        uint256 _uid;
        uint256 _amount;
    }

    uint contribution_counter;

    mapping(uint => Contribution) m_contributions;

    function () payable public {
        /* Receive amount */
        if(msg.value > 0) {
            emit receivedFunds(msg.sender, msg.value);
        }

        /* File contribution*/
        uint uid = getUserId();
        contribution_counter++;
        m_contributions[contribution_counter] = Contribution(msg.sender, uid, msg.value);
        emit contributionReceived(msg.sender, uid, msg.value);
    }

    /* TODO: Fill in function or get from frontend */
    function getUserId() private returns (uint) {
        return 1;
    }

}
