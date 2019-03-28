pragma solidity ^0.4.22;

import './mortal.sol';

contract CNV is mortal {

  event projectAdded(address indexed project);
  event projectRemoved(address project);
  event beneficiaryAdded(address indexed beneficiary);
  event beneficiaryRemoved(address beneficiary);
  event holderAdded(address indexed holder);
  event holderRemoved(address holder);

  mapping(address => bool) projects;
  mapping(address => bool) beneficiaries;
  mapping(address => bool) holders;

  //////

  function addProject(address project) onlyowner public {
    projects[project] = true;
    emit projectAdded(project);
  }

  function removeProject(address project) onlyowner public {
    projects[project] = false;
    emit projectRemoved(project);
  }

  function isProjectValid(address project) public view returns(bool isValid) {
    return projects[project];
  }

  //////

  function addBeneficiary(address beneficiary) onlyowner public {
    beneficiaries[beneficiary] = true;
    emit beneficiaryAdded(beneficiary);
  }

  function removeBeneficiary(address beneficiary) onlyowner public {
    beneficiaries[beneficiary] = false;
    emit beneficiaryRemoved(beneficiary);
  }

  function isBeneficiaryValid(address beneficiary) public view returns(bool isValid) {
    return beneficiaries[beneficiary];
  }

  //////

  function addHolder(address holder) onlyowner public {
    holders[holder] = true;
    emit holderAdded(holder);
  }

  function removeHolder(address holder) onlyowner public {
    holders[holder] = false;
    emit holderRemoved(holder);
  }

  function isHolderValid(address holder) public view returns(bool isValid) {
    return holders[holder];
  }

}
