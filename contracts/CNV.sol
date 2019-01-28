pragma solidity ^0.4.17;

import './mortal.sol';

contract CNV is mortal {

  event projectAdded(address indexed project);
  event projectRemoved(address project);
  event ownerAdded(address indexed owner);
  event ownerRemoved(address owner);
  event holderAdded(address indexed holder);
  event holderRemoved(address holder);

  mapping(address => bool) projects;
  mapping(address => bool) owners;
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

  function addOwner(address owner) onlyowner public {
    owners[owner] = true;
    emit ownerAdded(owner);
  }

  function removeOwner(address owner) onlyowner public {
    owners[owner] = false;
    emit ownerRemoved(owner);
  }

  function isOwnerValid(address owner) public view returns(bool isValid) {
    return owners[owner];
  }

  //////

  function addHolder(address holder) onlyowner public {
    holders[holder] = true;
    emit ownerAdded(holder);
  }

  function removeHolder(address holder) onlyowner public {
    holders[holder] = false;
    emit ownerRemoved(holder);
  }

  function isHolderValid(address holder) public view returns(bool isValid) {
    return holders[holder];
  }

}
