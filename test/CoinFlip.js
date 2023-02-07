const { expect } = require("chai");
const { ethers } = require("hardhat");
const {
    constants,
    expectRevert,
} = require('@openzeppelin/test-helpers');
require('dotenv').config({ path: __dirname + '/.env' });

const hre = require("hardhat");

describe.only("CoinFlip test", function() {
    beforeEach(async function() {
        [player] = await ethers.getSigners();
        hacker = await (await ethers.getContractFactory("CoinFlipHacker")).deploy(process.env.COINFLIP_ADDRESS);
        coinFlip = await ethers.getContractAt("CoinFlip", process.env.COINFLIP_ADDRESS);
        await hacker.deployed();
});
    describe("Hack test", function() {
        it("Guess correctly 10 times", async function() {
            expect(await coinFlip.consecutiveWins()).to.equal(0);
            for (i=0; i<10; i++) {
                const transactionResponse = await hacker.flip();
                await transactionResponse.wait();
            }
            expect(await coinFlip.consecutiveWins()).to.equal(10);
        });
    });
});