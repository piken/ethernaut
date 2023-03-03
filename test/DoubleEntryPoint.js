const { expect } = require("chai");
const { ethers } = require("hardhat");
const {
    constants,
    expectRevert,
} = require('@openzeppelin/test-helpers');
require('dotenv').config({ path: __dirname + '/.env' });

const hre = require("hardhat");
describe.only("DWT Detection Bot", function() {
    beforeEach(async function() {
        [player] = await ethers.getSigners();
        await hre.network.provider.request({
            method: "hardhat_impersonateAccount",
            params: [process.env.REALPLAYER_ADDERSS],
        });
        realplayer = await ethers.getSigner(process.env.REALPLAYER_ADDERSS);
        // transactionResponse = await player.sendTransaction({
        //     to: process.env.REALPLAYER_ADDERSS,
        //     gasLimit: 2_000_000,
        //     value: "10000000000000000000",
        //     data: "0x" 
        // });
        // await transactionResponse.wait();
        detectionBot = await (await ethers.getContractFactory("DWTDectionBot")).deploy(process.env.DWT_ADDRESS);
        await detectionBot.deployed();
        dwtToken = await ethers.getContractAt("DoubleEntryPoint", process.env.DWT_ADDRESS);
        forta = await ethers.getContractAt("Forta", await dwtToken.forta());
        cryptoVault = await ethers.getContractAt("CryptoVault", (await dwtToken.cryptoVault()));
});
    describe("DWT Detection Bot function verification", function() {
        it("Should revert after setting detection bot", async function() {
            await forta.connect(realplayer).setDetectionBot(detectionBot.address);
            await expectRevert(cryptoVault.sweepToken(await dwtToken.delegatedFrom()), "Alert has been triggered, reverting");
        });
    });
});