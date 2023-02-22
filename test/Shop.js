const { expect } = require("chai");
const { ethers } = require("hardhat");
const {
    constants,
    expectRevert,
} = require('@openzeppelin/test-helpers');
require('dotenv').config({ path: __dirname + '/.env' });

const hre = require("hardhat");

describe.only("Shop hack", function() {
    beforeEach(async function() {
        [player] = await ethers.getSigners();
        hacker = await (await ethers.getContractFactory("MaliciousBuyer")).deploy(process.env.SHOP_ADDRESS);
        hacker.deployed();
        shop = await ethers.getContractAt("Shop", process.env.SHOP_ADDRESS);
});
    describe("Hack test", function() {
        it("Should change the price", async function() {
            await hacker.buy();
            expect(await shop.price()).to.equal(50);
        });
    });
});