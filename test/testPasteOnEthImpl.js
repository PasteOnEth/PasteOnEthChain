
let PasteOnEthImpl = artifacts.require("./PasteOnEthImpl.sol");

let pasteOnEthInstance;

contract('PasteOnEthContract', function (accounts) {
  it("PasteOnEth implementation deployment", function() {
    //Fetching the contract instance of our smart contract
    return PasteOnEthImpl.deployed().then(function (instance) {
      //We save the instance in a global variable and all smart contract functions are called using this
      pasteOnEthInstance = instance;
      assert(pasteOnEthInstance !== undefined, 'PasteOnEthImpl contract should be defined');
    });
  });

  it("Non-admin should not be able to transfer admin for PasteOnEth implementation contract", function() {
    return pasteOnEthInstance.transferAdmin.call(accounts[2], {from: accounts[1]})
    .then(function (response) {
      console.log("should not expect a response but is ", response);
      assert(false == true);
    })
    .catch((err) => {
      assert(true == true);
    });
  });

  it("Admin should be able to transfer admin for PasteOnEth implementation contract", function() {
    return pasteOnEthInstance.transferAdmin.call(accounts[1], {from: accounts[0]})
    .then(function (response) {
      assert(true == true);
    })
    .catch((err) => {
      console.log("should not expect an error but is ", err);
      assert(false == true);
    });
  });

  it("PasteOnEth Implementation contract should not be initialized after construction", function() {
    return pasteOnEthInstance.initialize.call("test paste")
    .then(function (response) {
      console.log("should not expect a response but is ", response);
      assert(false == true);
    })
    .catch((err) => {
      assert(true == true);
    });
  });

  it("PasteOnEth Implementation contract should not have a store", function() {
    return pasteOnEthInstance.store.call()
    .then(function (response) {
      assert(response == "");
    })
    .catch((err) => {
      console.log("should not expect an error but is ", err);
      assert(false == true);
    });
  });

  it("PasteOnEth Implementation contract should not be able to change store", function() {
    return pasteOnEthInstance.changeStore.call("test paste")
    .then(function (response) {
      console.log("should not expect a response but is ", response);
      assert(false == true);
    })
    .catch((err) => {
      assert(true == true);
    });
  });
});
