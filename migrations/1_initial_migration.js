var PasteOnEth = artifacts.require("pasteOnEth");
var PasteOnEthFactory = artifacts.require("pasteOnEthFactory");

module.exports = async function(deployer, network, accounts) {
  const deployerAccount = accounts[0];

  await deployer.deploy(PasteOnEth);
  const pasteOnEthInstance = await PasteOnEth.deployed();

  console.log("Deployed PasteOnEth at address", pasteOnEthInstance.address);

  await deployer.deploy(PasteOnEthFactory, pasteOnEthInstance.address);
  const pasteOnEthFactoryInstance = await pasteOnEthInstance.deployed();

  console.log("Deployed PasteOnEthFactory at address", pasteOnEthFactoryInstance.address);
};
