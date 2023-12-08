const { ethers } = require('hardhat');
const { expect } = require('chai');

async function main() {
  const [deployer] = await ethers.getSigners();

  console.log('Deploying contracts with the account:', deployer.address);

  // Deploy TetherToken without constructor arguments
  const TetherToken = await ethers.getContractFactory('TetherToken');
  const tetherToken = await TetherToken.deploy();

  console.log('TetherToken deployed to:', tetherToken.address);

  // Deploying TransparentUpgradeableProxy
  const TransparentUpgradeableProxy = await ethers.getContractFactory('TransparentUpgradeableProxy');
  const adminAddress = '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266'; 
  const proxy = await TransparentUpgradeableProxy.deploy(tetherToken.address, adminAddress, '0x',{ gasLimit: 6000000 }); // '0x' for empty data

  console.log('TransparentUpgradeableProxy deployed to:', proxy.address);
  
  // Transfer tokens
 const receiverAddress = '0xeb7fbb5E893508df5EeE8A99de969CA02f6C0Ed3'; 
 const transferAmount = 100; 
 await tetherToken.transfer(receiverAddress, transferAmount);

 console.log(`Transferred ${transferAmount} tokens to ${receiverAddress}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
