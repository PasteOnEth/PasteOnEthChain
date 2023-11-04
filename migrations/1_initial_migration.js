var PasteOnEthImpl = artifacts.require("PasteOnEthImpl");
var PasteOnEthProxy = artifacts.require("PasteOnEthProxy");

module.exports = async function(deployer, network, accounts) {

  // await deployer.deploy(PasteOnEthImpl, "initial store");
  await deployer.deploy(PasteOnEthImpl);
  const pasteOnEthInstance = await PasteOnEthImpl.deployed();
  console.log("Deployed PasteOnEth at address", pasteOnEthInstance.address);

  const pasteData = web3.eth.abi.encodeFunctionCall({
    name: 'initialize',
    type: 'function',
    inputs: [
        {
            type: 'string',
            name: 'initStore',
        },
    ],
}, ["test paste"]);

  await deployer.deploy(PasteOnEthProxy, pasteOnEthInstance.address, pasteData, {from: accounts[1]});
  const pasteOnEthProxyInstance = await PasteOnEthProxy.deployed();
  console.log("Deployed PasteOnEthProxy at address", pasteOnEthProxyInstance.address);
};