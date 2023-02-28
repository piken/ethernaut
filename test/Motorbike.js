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
        hacker = await (await ethers.getContractFactory("EngineHacker")).deploy(process.env.ENGINE_ADDRESS);
        await hacker.deployed();
});
    describe("Hack test", function() {
        it("Should become the admin of proxy", async function() {
            await hacker.pwn();
            expect((await ethers.provider.getCode(process.env.ENGINE_ADDRESS)).length).to.equal(2);
        });
    });
});