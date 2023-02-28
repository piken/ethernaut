const { expect } = require("chai");
const { ethers } = require("hardhat");
const {
    constants,
    expectRevert,
} = require('@openzeppelin/test-helpers');
require('dotenv').config({ path: __dirname + '/.env' });

const hre = require("hardhat");


describe.only("PuzzleWallet hack", function() {
    beforeEach(async function() {
        [player] = await ethers.getSigners();
        hacker = await (await ethers.getContractFactory("PuzzleWalletHacker")).deploy(process.env.PUZZLEWALLET_ADDRESS);
        await hacker.deployed();
        proxy = await ethers.getContractAt("IPuzzleProxy", process.env.PUZZLEWALLET_ADDRESS);
});
    describe("Hack test", function() {
        it("Should become the admin of proxy", async function() {
            await hacker.pwn({value: ethers.provider.getBalance(process.env.PUZZLEWALLET_ADDRESS)});
            expect(await proxy.admin()).to.equal(player.address);
        });
    });
});