require("@nomicfoundation/hardhat-ethers");
require('dotenv').config();
require('@nomiclabs/hardhat-waffle');
require('@openzeppelin/hardhat-upgrades');

module.exports = {
  solidity: "0.8.0",
  networks: {
    avalanche: {
      url: 'https://api.avax-test.network/ext/bc/C/rpc',
      accounts: [process.env.PRIVATE_KEY],
    },
  },
  settings: {
    optimizer: {
      enabled: true,
      runs: 200,
    },
  },
  plugins: ['@openzeppelin/hardhat-upgrades'],
};
