const { expect } = require("chai");
const { ethers } = require("hardhat");
const {
    constants,
    expectRevert,
} = require('@openzeppelin/test-helpers');
require('dotenv').config({ path: __dirname + '/.env' });

const hre = require("hardhat");

describe.only("DexTwo hack", function() {
    beforeEach(async function() {
        [player] = await ethers.getSigners();
        hacker = await (await ethers.getContractFactory("DexTwoHacker")).deploy(process.env.DEXTWO_ADDRESS);
        await hacker.deployed();
        dexTwo = await ethers.getContractAt("DexTwo", process.env.DEXTWO_ADDRESS);
        token1 = await ethers.getContractAt("SwappableTokenTwo", await dexTwo.token1());
        token2 = await ethers.getContractAt("SwappableTokenTwo", await dexTwo.token2());
    });
    describe("Hack test", function() {
        it("Should drain both tokens", async function() {
            await hacker.drain();
            expect(await token1.balanceOf(process.env.DEXTWO_ADDRESS)).to.equal(0);
            expect(await token2.balanceOf(process.env.DEXTWO_ADDRESS)).to.equal(0);
        });
    });

});
