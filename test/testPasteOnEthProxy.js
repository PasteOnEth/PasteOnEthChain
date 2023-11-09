
let PasteOnEthImpl = artifacts.require("./PasteOnEthImpl.sol");
let PasteOnEthImplV2 = artifacts.require("./PasteOnEthImplV2.sol");
let PasteOnEthProxy = artifacts.require("./PasteOnEthProxy.sol");

let pasteOnEthInstance;
let pasteOnEthV2Instance;
let pasteOnEthProxyInstance;
let pasteOnEthProxyV2Instance;

contract('PasteOnEthProxyContract', function (accounts) {
    before(async() => {
        await PasteOnEthImpl.deployed().then(function (instance) {
            //We save the instance in a global variable and all smart contract functions are called using this
            pasteOnEthInstance = instance;
            assert(pasteOnEthInstance !== undefined, 'PasteOnEthImpl contract should be defined');
        });
        await PasteOnEthImplV2.deployed().then(function (instance) {
            //We save the instance in a global variable and all smart contract functions are called using this
            pasteOnEthV2Instance = instance;
            assert(pasteOnEthV2Instance !== undefined, 'PasteOnEthImplV2 contract should be defined');
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

  it("PasteOnEth proxy cannot be re-initalized", function() {
    return pasteOnEthProxyInstance.methods.initialize("New store").send({from: accounts[1]})
    .then(function (response) {
      console.log("Did not expect response but got ",response);
      assert (false == true);
    }).catch((err) => {
      assert (true == true);
    });
  });

  it("PasteOnEth proxy must have the owner set to initialize message sender", function() {
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
  
  it("PasteOnEth proxy deployment with implementation V2", function() {    
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
        [pasteOnEthV2Instance.address, pasteData]
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
        pasteOnEthProxyV2Instance = new web3.eth.Contract(abi = PasteOnEthImpl.abi, address = txHash.contractAddress);
        assert(pasteOnEthProxyV2Instance !== undefined, 'pasteOnEthProxyInstanceV2 contract should be defined');
      })
      .catch(error => {
        console.log("Error while initializing contract ", error);
        assert(true == false);
    });
  });

  it("PasteOnEth proxy implementation should be upgradable by owner", function() {
    return pasteOnEthProxyInstance.methods.upgradeTo(pasteOnEthV2Instance.address)
    .send({from: accounts[1]})
    .then(function (response) {
        assert(true == true);
      })
    .catch((err) => {
      console.log("should not expect an error but is ", err);
      assert(false == true);
    });  
  });

  it("PasteOnEth proxy implementation should not be upgradable by non-owner", function() {
    return pasteOnEthProxyInstance.methods.upgradeTo(pasteOnEthV2Instance.address)
    .send({from: accounts[2]})
    .then(function (response) {
        console.log("should not expect a response but is ", err);
        assert(false == true);
      })
    .catch((err) => {
      assert(true == true);
    });  
  });

  it("Upgraded PasteOnEthProxy should have updated logic", function() {
    return pasteOnEthProxyInstance.methods.upgradeTo(pasteOnEthV2Instance.address)
    .send({from: accounts[1]})
    .then(function (response) {
        return pasteOnEthProxyInstance.methods.changeStore("Test paste on new implementation").send({from: accounts[1]})
        .then(function (response) {
            return pasteOnEthProxyInstance.methods.store().call()
            .then(function (response) {
             assert(response == "Test paste on new implementation V2"); 
            })
             .catch((err) => {
                console.log("Should not expect error but is ", err);
                assert (false == true);
            });
        });
    })
    .catch((err) => {
      console.log("should not expect an error but is ", err);
      assert(false == true);
    });  
  });

    it("PasteOnEth proxy must not reset the owner after calling renounceOwnership from non-owner's account", function() {
    return pasteOnEthProxyInstance.methods.renounceOwnership().send({from: accounts[2]})
    .then(function (response) {
      console.log("Did not expect successful transaction but got ", response);
      assert (false == true);
    }).catch((err) => {
      assert (true == true);
    });
  });

  it("PasteOnEth proxy should not be able to call proxiableUUID", function() {
    return pasteOnEthProxyInstance.methods.proxiableUUID().call()
    .then(function (response) {
      console.log("Did not expect a reponse but got ", response);
      assert(true == false);
    })
    .catch((err) => {
      assert(true == true);
    });
  });

  // This test must be executed at the end since it voids the owner 
  it("PasteOnEth proxy must reset the owner after calling renounceOwnership from owner's account", function() {
    return pasteOnEthProxyInstance.methods.renounceOwnership().send({from: accounts[1]})
    .then(function (response) {
        pasteOnEthProxyInstance.methods.owner().call()
            .then(function (response) {
                assert (response == "0x0000000000000000000000000000000000000000");
            }).catch((err) => {
                console.log("Should not expect error but is ", err);
                assert (false == true);
            })
        })
    .catch((err) => {
      console.log("Should not expect error but is ", err);
      assert (false == true);
    });
  });
});
