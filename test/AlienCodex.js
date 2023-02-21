const { expect } = require("chai");
const { ethers } = require("hardhat");
const {
    constants,
    expectRevert,
} = require('@openzeppelin/test-helpers');
require('dotenv').config({ path: __dirname + '/.env' });

const hre = require("hardhat");

const  ALIENCODEX_ABI = [
    "function owner() public view returns (address)"
];
// const INDEX_OF_OWNER = 0x4ef1d2ad89edf8c4d91132028e8195cdf30bb4b5053d4f8cd260341d4805f30a;
describe.only("AlienCodex hack", function() {
    beforeEach(async function() {
        [player] = await ethers.getSigners();
        hacker = await (await ethers.getContractFactory("AlienCodexHacker")).deploy();
        hacker.deployed();
        alienCodex = await ethers.getContractAt("IAlienCodex", process.env.ALIENCODEX_ADDRESS);
        // alienCodex = new ethers.Contract(process.env.ALIENCODEX_ADDRESS, ALIENCODEX_ABI, ethers.provider);
});
    describe("Hack test", function() {
        it("Should claim the ownership", async function() {
            await hacker.claimOwner(process.env.ALIENCODEX_ADDRESS);
            expect(await alienCodex.owner()).to.equal(player.address);
        });
    });
});