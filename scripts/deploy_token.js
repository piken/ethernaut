// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
require('dotenv').config({ path: __dirname + '/.env' });

const { ethers } = require("hardhat");

const  TOKEN_ABI = [
    "function transfer(address _to, uint _value) public returns (bool)",
    "function balanceOf(address _owner) public view returns (uint balance)"
];

async function main() {
    [player] = await ethers.getSigners();
    token = new ethers.Contract(process.env.TOKEN_ADDRESS, TOKEN_ABI, ethers.provider);
    initialBalance = await token.balanceOf(player.address);
    const transactionResponse = await token.connect(player).transfer(process.env.TOKEN_ADDRESS, initialBalance.add(1));;
    await transactionResponse.wait();
    console.log("token balance is ", (await token.balanceOf(player.address)).toHexString());
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
// run this script after Fallback contract was deployed
// npx hardhat run scripts/deploy.js --network goerli