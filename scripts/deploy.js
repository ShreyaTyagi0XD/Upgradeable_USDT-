const { ethers, upgrades } = require('hardhat');

async function main() {
  const [deployer] = await ethers.getSigners();

  console.log('Deploying contracts with the account:', deployer.address);

  // Make sure to import the correct contracts
  const LogicImplementation = await ethers.getContractFactory('Logic_Implementation');
  const logicImplementation = await LogicImplementation.deploy('Tether', 'USDT', 1000);
  await logicImplementation.deployed();

  console.log('Logic_Implementation deployed to:', logicImplementation.address);

  const admin = "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266";

  // Use upgrades.deployProxy with the values array and initializer
  const transparentProxy = await upgrades.deployProxy(
    LogicImplementation,
    [admin],
    { initializer: 'initialize', unsafeAllow: ['constructor'] }
  );

  console.log('TransparentUpgradeableProxy deployed to:', transparentProxy.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
