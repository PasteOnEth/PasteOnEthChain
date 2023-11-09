
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

  it("PasteOnEth Implementation contract should not have an owner", function() {
    return pasteOnEthInstance.owner.call()
    .then(function (response) {
      assert(response == "0x0000000000000000000000000000000000000000");
    })
    .catch((err) => {
      console.log("Not expecting an error but got ", err);
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

  it("PasteOnEth Implementation contract should have the correct proxiable UUID as defined in ERC-1967", function() {
    return pasteOnEthInstance.proxiableUUID.call()
    .then(function (response) {
      assert(response == "0x360894a13ba1a3210667c828492db98dca3e2076cc3735a920a3ca505d382bbc");
    })
    .catch((err) => {
      console.log("Did not expect an error but got ", err);
      assert(true == false);
    });
  });
});
