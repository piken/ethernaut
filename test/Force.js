const { expect } = require("chai");
const { ethers } = require("hardhat");
const {
    constants,
    expectRevert,
} = require('@openzeppelin/test-helpers');
require('dotenv').config({ path: __dirname + '/.env' });

const hre = require("hardhat");

describe.only("Force hack", function() {
    beforeEach(async function() {
        [player] = await ethers.getSigners();
        hacker = await (await ethers.getContractFactory("ForceHacker")).deploy();
        await hacker.deployed();
});
    describe("Hack test", function() {
        it("Should make the balance of Force greater than zero", async function() {
            expect(await ethers.provider.getBalance(process.env.FORCE_ADDRESS)).to.equal(0);
            await hacker.kill(process.env.FORCE_ADDRESS, {value:1});
            expect(await ethers.provider.getBalance(process.env.FORCE_ADDRESS)).to.not.equal(0);
        });
    });
});