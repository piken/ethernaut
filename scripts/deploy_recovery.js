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
    lostContractHash = ethers.utils.solidityKeccak256(["bytes2", "address", "bytes1"], ["0xd694", process.env.RECOVERY_ADDRESS, "0x01"]);
    lostContractAddress = ethers.BigNumber.from(lostContractHash).mask(160).toHexString();
    console.log("Address of lost contract is", lostContractAddress);
    transactionResponse = await player.sendTransaction({
        to: lostContractAddress,
        gasLimit: 2_000_000,
        data: (new ethers.utils.Interface(["function destroy(address) public"])).encodeFunctionData("destroy", [player.address])
    });
    await transactionResponse.wait();
    console.log("Balance of lost contract is ", (await ethers.provider.getBalance(lostContractAddress)).toString());
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
// run this script after Fallback contract was deployed
// npx hardhat run scripts/deploy.js --network goerli