const { ethers, upgrades } = require('hardhat');

async function main() {
  const [deployer] = await ethers.getSigners();

  const implementationAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3"; // Address of the deployed implementation contract

  console.log('Deploying proxy contract...');
  const TransparentUpgradeableProxy = await ethers.getContractFactory('TransparentUpgradeableProxy');
  const proxy = await upgrades.deployProxy(TransparentUpgradeableProxy,implementationAddress, deployer.address, "0x000000000000000000000000000000000000000000000000000000000000006000000000000000000000000000000000000000000000000000000000000000a000000000000000000000000000000000000000000000000000000000000003e80000000000000000000000000000000000000000000000000000000000000006546574686572000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000045553445400000000000000000000000000000000000000000000000000000000");
  await proxy.deployed();

  console.log('Proxy contract deployed to:', proxy.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
