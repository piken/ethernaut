require("@nomicfoundation/hardhat-toolbox");
require('dotenv').config({ path: __dirname + '/.env' });

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  networks: {
    goerli: {
      url:process.env.ALCHEMY_API_KEY,
      accounts: [process.env.GOERLI_PRIVATE_KEY]
    },
    hardhat: {
      forking: {
        url: process.env.ALCHEMY_API_KEY,
        // blockNumber: 8535451
      }
    },
  },  
  solidity: "0.8.17",
};
