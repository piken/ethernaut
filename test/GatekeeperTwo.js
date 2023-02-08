const { expect } = require("chai");
const { ethers } = require("hardhat");
const {
    constants,
    expectRevert,
} = require('@openzeppelin/test-helpers');
require('dotenv').config({ path: __dirname + '/.env' });

const hre = require("hardhat");

describe.only("GatekeeperTwoHacker hack", function() {
    beforeEach(async function() {
        [player] = await ethers.getSigners();
        hacker = await (await ethers.getContractFactory("GatekeeperTwoHacker")).deploy(process.env.GATEKEEPERTWO_ADDRESS, {gasLimit: 2_000_000});
        await hacker.deployed();
        gatekeeperTwo = await ethers.getContractAt("GatekeeperTwo", process.env.GATEKEEPERTWO_ADDRESS);
});
    describe("Hack test", function() {
        it("Should fool the gatekeeperOne", async function() {
            expect(await gatekeeperTwo.entrant()).to.equal(player.address);
        });
    });
});