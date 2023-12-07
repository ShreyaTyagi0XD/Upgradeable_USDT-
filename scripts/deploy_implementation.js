// scripts/deploy_implementation.js
const { ethers } = require("hardhat"); // Import the ethers library

async function main() {
  const [deployer] = await ethers.getSigners();

  console.log('Deploying contracts with the account:', deployer.address);

  const LogicImplementation = await ethers.getContractFactory('Logic_Implementation');
  const logicImplementation = await LogicImplementation.deploy('Tether', 'USDT', 1000);

  console.log('Logic_Implementation deployed to:', logicImplementation.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
