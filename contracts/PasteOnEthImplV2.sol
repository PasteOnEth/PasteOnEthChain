// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts@4.9.2/proxy/utils/UUPSUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable@4.9.2/access/OwnableUpgradeable.sol";

/**
@title A smart contract V2 to save pastes from pasteoneth.com to eth
@author https://www.linkedin.com/in/omkar-pathak/
@notice Note that this contract is NOT currently used. The primary use case of this contract is to test if Paste Proxies are upgradable 
*/
contract PasteOnEthImplV2 is UUPSUpgradeable, Initializable, OwnableUpgradeable {
    string public store;

    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor () {
        _disableInitializers();
    }

    function initialize(string memory initStore) external initializer {
        __Ownable_init();
        store = initStore;
    }

    function changeStore(string memory newStore) external onlyProxy() onlyOwner() {
        store = string(abi.encodePacked(newStore, " V2"));
    }

    function _authorizeUpgrade(address) internal override onlyOwner {}
}