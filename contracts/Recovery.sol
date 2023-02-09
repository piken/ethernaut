pragma solidity ^0.8.0;

contract Recovery {

  //generate tokens
  function generateToken(string memory _name, uint256 _initialSupply) public {
    new SimpleToken(_name, msg.sender, _initialSupply);
  
  }
}

contract SimpleToken {

  string public name;
  mapping (address => uint) public balances;

  // constructor
  constructor(string memory _name, address _creator, uint256 _initialSupply) {
    name = _name;
    balances[_creator] = _initialSupply;
  }

  // collect ether in return for tokens
  receive() external payable {
    balances[msg.sender] = msg.value * 10;
  }

  // allow transfers of tokens
  function transfer(address _to, uint _amount) public { 
    require(balances[msg.sender] >= _amount);
    balances[msg.sender] = balances[msg.sender] - _amount;
    balances[_to] = _amount;
  }

  // clean up after ourselves
  function destroy(address payable _to) public {
    selfdestruct(_to);
  }
}

contract AddressCalculator {
    function calculate(address addr, uint nonce) public pure returns (address) {
        if (nonce == 0)        return address(uint160(uint(keccak256(abi.encodePacked(bytes1(0xd6),bytes1(0x94),addr,bytes1(0x80))))));
        if (nonce < 0x80)      return address(uint160(uint(keccak256(abi.encodePacked(bytes1(0xd6),bytes1(0x94),addr, bytes1(uint8(nonce)))))));
        if (nonce < 0x100)     return address(uint160(uint(keccak256(abi.encodePacked(bytes1(0xd7),bytes1(0x94),addr, bytes1(0x81), bytes1(uint8(nonce)))))));
        if (nonce < 0x10000)   return address(uint160(uint(keccak256(abi.encodePacked(bytes1(0xd8),bytes1(0x94),addr, bytes1(0x82), bytes2(uint16(nonce)))))));
        if (nonce < 0x1000000) return address(uint160(uint(keccak256(abi.encodePacked(bytes1(0xd9),bytes1(0x94),addr, bytes1(0x83), bytes3(uint24(nonce)))))));
        return address(uint160(uint(keccak256(abi.encodePacked(bytes1(0xda),bytes1(0x94),addr, bytes1(0x84), bytes4(uint32(nonce)))))));
    }
}