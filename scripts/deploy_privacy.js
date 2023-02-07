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
    privacy = await ethers.getContractAt("Privacy", process.env.PRIVACY_ADDRESS);
    key_data = await ethers.provider.getStorageAt(process.env.PRIVACY_ADDRESS, 5);
    key = await key_data.slice(0,34); //0x||16bytes data
    transactionResponse = await privacy.unlock(key);
    await transactionResponse.wait();
    console.log("Privacy is", (await privacy.locked()) == true ? "locked":"unlocked");
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
// run this script after Fallback contract was deployed
// npx hardhat run scripts/deploy.js --network goerli