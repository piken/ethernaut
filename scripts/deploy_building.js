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

    myBuilding = await (await ethers.getContractFactory("MyBuilding")).deploy();
    await myBuilding.deployed();
    elevator = await ethers.getContractAt("Elevator", process.env.ELEVATOR_ADDRESS);

    transactionResponse = await myBuilding.goTo(process.env.ELEVATOR_ADDRESS);
    await transactionResponse.wait();
    console.log("This floor is",(await elevator.top()) == true ? "":" not ", "the top of the building");
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
// run this script after Fallback contract was deployed
// npx hardhat run scripts/deploy.js --network goerli