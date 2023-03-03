const { expect } = require("chai");
const { ethers } = require("hardhat");
const {
    constants,
    expectRevert,
} = require('@openzeppelin/test-helpers');
require('dotenv').config({ path: __dirname + '/.env' });

const hre = require("hardhat");
describe.only("Good Samaritan", function() {
    beforeEach(async function() {
        [player] = await ethers.getSigners();
        hacker = await (await ethers.getContractFactory("GoodSamaritanHacker")).deploy(process.env.GOODSAMARITAN_ADDRESS);
        hacker.deployed();
        goodSamaritan = await ethers.getContractAt("GoodSamaritan", process.env.GOODSAMARITAN_ADDRESS);
        coin = await ethers.getContractAt("Coin", await goodSamaritan.coin());
});
    describe("Good Samaritan hack", function() {
        it("Should drain all coins from good samaritan's wallet", async function() {
            await hacker.pwn();
            expect(await coin.balances(await goodSamaritan.wallet())).to.equal(0);
        });
    });
});