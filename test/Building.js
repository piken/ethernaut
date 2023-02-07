const { expect } = require("chai");
const { ethers } = require("hardhat");
const {
    constants,
    expectRevert,
} = require('@openzeppelin/test-helpers');
require('dotenv').config({ path: __dirname + '/.env' });

const hre = require("hardhat");

describe.only("Building hack", function() {
    beforeEach(async function() {
        [player] = await ethers.getSigners();
        myBuilding = await (await ethers.getContractFactory("MyBuilding")).deploy();
        await myBuilding.deployed();
        elevator = await ethers.getContractAt("Elevator", process.env.ELEVATOR_ADDRESS);
});
    describe("Hack test", function() {
        it("Should go to the top of the building", async function() {
            expect(await elevator.top()).to.equal(false);
            await myBuilding.goTo(process.env.ELEVATOR_ADDRESS);
            expect(await elevator.top()).to.equal(true);
        });
    });
});