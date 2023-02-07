const { expect } = require("chai");
const { ethers } = require("hardhat");
const {
    constants,
    expectRevert,
} = require('@openzeppelin/test-helpers');
require('dotenv').config({ path: __dirname + '/.env' });

const hre = require("hardhat");

describe.only("Telephone test", function() {
    beforeEach(async function() {
        [player] = await ethers.getSigners();
        hacker = await (await ethers.getContractFactory("TelephoneHacker")).deploy();
        telephone = await ethers.getContractAt("Telephone", process.env.TELEPHONE_ADDRESS);
        await hacker.deployed();
});
    describe("Hack test", function() {
        it("Should change owner to player", async function() {
            expect(await telephone.owner()).to.not.equal(player.address);
            await hacker.changeOwner(process.env.TELEPHONE_ADDRESS);
            expect(await telephone.owner()).to.equal(player.address);
        });
    });
});