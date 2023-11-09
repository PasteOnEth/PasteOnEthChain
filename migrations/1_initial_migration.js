var PasteOnEthImpl = artifacts.require("PasteOnEthImpl");
var PasteOnEthImplV2 = artifacts.require("PasteOnEthImplV2")
var PasteOnEthProxy = artifacts.require("PasteOnEthProxy");

module.exports = async function(deployer, network, accounts) {

  await deployer.deploy(PasteOnEthImpl);
  const pasteOnEthInstance = await PasteOnEthImpl.deployed();
  console.log("Deployed PasteOnEth at address", pasteOnEthInstance.address);

  await deployer.deploy(PasteOnEthImplV2);
  const pasteOnEthV2Instance = await PasteOnEthImplV2.deployed();
  console.log("Deployed PasteOnEthImplV2 at address", pasteOnEthV2Instance.address);
  

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
  const pasteOnEthProxy1Instance = await PasteOnEthProxy.deployed();
  console.log("Deployed PasteOnEthProxy 1 at address", pasteOnEthProxy1Instance.address);

  await deployer.deploy(PasteOnEthProxy, pasteOnEthV2Instance.address, pasteData, {from: accounts[2]});
  const pasteOnEthProxy2Instance = await PasteOnEthProxy.deployed();
  console.log("Deployed PasteOnEthProxy 2 at address", pasteOnEthProxy2Instance.address);
};