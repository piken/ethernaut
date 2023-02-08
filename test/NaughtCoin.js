const { expect } = require("chai");
const { ethers } = require("hardhat");
const {
    constants,
    expectRevert,
} = require('@openzeppelin/test-helpers');
require('dotenv').config({ path: __dirname + '/.env' });

const hre = require("hardhat");

describe.only("NaughtCoin hack", function() {
    beforeEach(async function() {
        [player] = await ethers.getSigners();
        naughtCoin = await (await ethers.getContractFactory("NaughtCoin")).deploy(player.address);
        naughtCoin.deployed();
        hacker = await (await ethers.getContractFactory("NaughtCoinHacker")).deploy(naughtCoin.address);
        hacker.deployed();
});
    describe("Hack test", function() {
        it("Should transfer all token from player", async function() {
            expect(await naughtCoin.balanceOf(player.address)).to.not.equal(0);
            await naughtCoin.connect(player).approve(hacker.address, ethers.constants.MaxUint256);
            await hacker.transferAllTokens();
            expect(await naughtCoin.balanceOf(player.address)).to.equal(0);
        });
    });
});