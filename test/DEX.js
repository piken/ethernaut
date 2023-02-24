const { expect } = require("chai");
const { ethers } = require("hardhat");
const {
    constants,
    expectRevert,
} = require('@openzeppelin/test-helpers');
require('dotenv').config({ path: __dirname + '/.env' });

const hre = require("hardhat");

describe.only("Dex hack", function() {
    beforeEach(async function() {
        [player] = await ethers.getSigners();
        hacker = await (await ethers.getContractFactory("DEXHacker")).deploy(process.env.DEX_ADDRESS);
        await hacker.deployed();
        dex = await ethers.getContractAt("Dex", process.env.DEX_ADDRESS);
        token1 = await ethers.getContractAt("SwappableToken", await dex.token1());
        token2 = await ethers.getContractAt("SwappableToken", await dex.token2());
        await hre.network.provider.request({
            method: "hardhat_impersonateAccount",
            params: [process.env.WHALE_ADDERSS],
        });
        whale = await ethers.getSigner(process.env.WHALE_ADDERSS);
        await token1.connect(whale).transfer(hacker.address, await token1.balanceOf(process.env.WHALE_ADDERSS));
        await token2.connect(whale).transfer(hacker.address, await token2.balanceOf(process.env.WHALE_ADDERSS));
    });
    describe("Hack test", function() {
        it("Should drain one of token", async function() {
            await hacker.drain();
            expect((await token1.balanceOf(process.env.DEX_ADDRESS))*(await token2.balanceOf(process.env.DEX_ADDRESS))).to.equal(0)
        });
    });

});
