
let PasteOnEth = artifacts.require("./PasteOnEth.sol");
let PasteOnEthFactory = artifacts.require("./PasteOnEthFactory.sol");

let pasteOnEthInstance;
let pasteOnEthFactoryInstance;
let pasteOnEthProxyInstance;

contract('PasteOnEthContract', function (accounts) {
  it("Contract deployment", function() {
    //Fetching the contract instance of our smart contract
    return PasteOnEth.deployed().then(function (instance) {
      //We save the instance in a gDlobal variable and all smart contract functions are called using this
      pasteOnEthInstance = instance;
      assert(pasteOnEthInstance !== undefined, 'PasteOnEth contract should be defined');
    });
  });

  it("Contract factory deployment", function() {
    return PasteOnEthFactory.deployed(pasteOnEthInstance).then(function(instance) {
      pasteOnEthFactoryInstance = instance;
      assert(pasteOnEthFactoryInstance !== undefined, 'PasteOnEthFactory contract should be defined');
    })
  })

  it("Contract proxy deployment", function() {
    return pasteOnEthFactoryInstance.createPasteOnEth.call(
      accounts[1],"test condition"
    ).then((retAddress) => {
      console.log("Proxy address is ", retAddress);
      pasteOnEthProxyInstance = new web3.eth.Contract(PasteOnEth.abi, retAddress);
      assert(pasteOnEthFactoryInstance !== undefined, 'pasteOnEthProxy contract should be defined');
    }).catch((err) => {
      console.log("error seen", err);
      assert (false == true);
    });
  })

  /*
  it("Proxy contract is initialized correctly", function() {
      // console.log("proxy instance", wordPromiseProxyInstance);

      // return wordPromiseProxyInstance.methods.signedPromise().send({ from: accounts[3] }).on('error', function(confirmation, receipt) {
      //   const returnValue = receipt;
      //   // console.log("return value is", web3.utils.hexToUtf8(returnValue));
      //   console.log("return value is", returnValue);
      // });

      return wordPromiseProxyInstance.methods.signedPromise().call({ from: accounts[5], gas: 2000000000 }, (error, result) => {
        if (error) {
          console.error(error);
        } else {
          const returnValue = result;
          // console.log("return value is", web3.utils.hexToUtf8(returnValue));
          console.log("return value is", returnValue);
        }
      });

      // return wordPromiseProxyInstance.methods.signedPromise().send({from: accounts[3]}).then((result) => {
      //   console.log("result is ", result);
      //   // assert("")
      //   return;
      // }).catch((error) => {
      //   console.log("Error calling function due to ", error);
      //   assert(true === false);
      //   return;
      // });
  })
  */
});
