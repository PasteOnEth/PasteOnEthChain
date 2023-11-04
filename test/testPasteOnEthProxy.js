
let PasteOnEthImpl = artifacts.require("./PasteOnEthImpl.sol");
let PasteOnEthProxy = artifacts.require("./PasteOnEthProxy.sol");

let pasteOnEthInstance;
let pasteOnEthProxyInstance;

contract('PasteOnEthProxyContract', function (accounts) {
    before(function () {
        return PasteOnEthImpl.deployed().then(function (instance) {
            //We save the instance in a global variable and all smart contract functions are called using this
            pasteOnEthInstance = instance;
            assert(pasteOnEthInstance !== undefined, 'PasteOnEthImpl contract should be defined');
        });
    });

  it("PasteOnEth proxy deployment", function() {    
    // The encoded function call that the proxy uses to initialize the implementation contract
    const pasteData = web3.eth.abi.encodeFunctionCall({
        name: 'initialize',
        type: 'function',
        inputs: [
            {
                type: 'string',
                name: 'initStore'
            },
        ],
    }, ["Test paste"]);

    // Encode the constructor parameters for the proxy contract
    const proxyConstructorData = web3.eth.abi.encodeParameters(
        ['address', 'bytes'], 
        [pasteOnEthInstance.address, pasteData]
    );

    // Construct params object for the transaction. 
    //   from: the account to use for sending transaction
    //   data: the bytecode of the compiled contract followed by the encoded constructor arguments
    const params = {
        from: accounts[1],
        data: PasteOnEthProxy.bytecode + proxyConstructorData.slice(2),
        gas: "900000"
    };

    return web3.eth.sendTransaction(params)
      .then(txHash => {
        pasteOnEthProxyInstance = new web3.eth.Contract(abi = PasteOnEthImpl.abi, address = txHash.contractAddress);
        assert(pasteOnEthProxyInstance !== undefined, 'pasteOnEthProxyInstance contract should be defined');
      })
      .catch(error => {
        console.log("Error while initializing contract ", error);
        assert(true == false);
    });
  });

  it("PasteOnEth proxy must be initalized with the right store", function() {
    return pasteOnEthProxyInstance.methods.store().call()
    .then(function (response) {
      assert (response == "Test paste");
    }).catch((err) => {
      console.log("Should not expect error but is ", err);
      assert (false == true);
    });
  });

  it("PasteOnEth proxy must have the owner as the initialize message sender", function() {
    return pasteOnEthProxyInstance.methods.owner().call()
    .then(function (response) {
      assert (response == accounts[1]);
    }).catch((err) => {
      console.log("Should not expect error but is ", err);
      assert (false == true);
    });
  });

  it("Non-owner should not be able to transfer ownership for PasteOnEth proxy contract", function() {
    return pasteOnEthProxyInstance.methods.transferOwnership(accounts[3]).call({from: accounts[2]})
    .then(function (response) {
      console.log("should not expect a response but is ", response);
      assert(false == true);
    })
    .catch((err) => {
      assert(true == true);
    });
  });

  it("Owner should be able to transfer ownership for PasteOnEth proxy contract", function() {
    return pasteOnEthProxyInstance.methods.transferOwnership(accounts[2]).call({from: accounts[1]})
    .then(function (response) {
      assert(true == true);
    })
    .catch((err) => {
      console.log("should not expect an error but is ", err);
      assert(false == true);
    });
  });

  it("PasteOnEth proxy non-owner should not be able to change store", function() {
    return pasteOnEthProxyInstance.methods.changeStore("Test paste V2").send({from: accounts[2]})
    .then(function (response) {
        console.log("changeStore should not go through but it went ", response);
        assert(false == true);
    })
    .catch((err) => {
      assert(true == true);
    });
  });

  it("PasteOnEth proxy owner should be able to change store", function() {
    return pasteOnEthProxyInstance.methods.changeStore("Test paste V2").send({from: accounts[1]})
    .then(function (response) {
        return pasteOnEthProxyInstance.methods.store().call()
        .then(function (response) {
            assert(response == "Test paste V2"); 
        })
        .catch((err) => {
            console.log("Should not expect error but is ", err);
            assert (false == true);
        });
    });  
  });

  it("PasteOnEth proxy should not be able to change admin", function() {
    return pasteOnEthProxyInstance.methods.transferAdmin(accounts[3]).send({from: accounts[1]})
    .then(function (response) {
        console.log("should not be successful but is ", response);
        assert(false == true);
    })
    .catch((err) => {
      assert(true == true);
    }); 
  });
});
