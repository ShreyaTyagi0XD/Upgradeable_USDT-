require("@nomicfoundation/hardhat-ethers");
require('dotenv').config();
require('@nomiclabs/hardhat-waffle');
require('@openzeppelin/hardhat-upgrades');

module.exports = {
  solidity: "0.8.20",
  networks: {
    localhost: {
      url: 'http://localhost:8545',
      accounts: [process.env.LOCALHOST_PRIVATE_KEY],
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
