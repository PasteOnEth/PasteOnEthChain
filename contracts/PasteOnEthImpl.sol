// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts@4.9.2/proxy/utils/UUPSUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable@4.9.2/access/OwnableUpgradeable.sol";

/**
@title A smart contract to save pastes from pasteoneth.com to eth
@author https://www.linkedin.com/in/omkar-pathak/
@notice You can't construct this contract and it's meant to be a UUPSUpgradeable contract behind paste proxies
*/
contract PasteOnEthImpl is UUPSUpgradeable, Initializable, OwnableUpgradeable {
    /**
    @dev This variable stores the paste content in the contract's storage
    */
    string public store;
    address private admin;

    event ChangeStoreEvent(string oldStore, string newStore);

    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor () {
        admin = msg.sender;
        _disableInitializers();
    }

    /**
    @param initStore The UUPSUpgradable implementation contract address
    @dev Initialize function that must be called only once per proxy
    @notice The initialize functions that's invoked for every new paste
    */
    function initialize(string memory initStore) external initializer {
        __Ownable_init();
        store = initStore;
    }

    /**
    @param newStore The new string store that is used to replace the current store
    @notice Method to change store of the paste that can be invoked by the author only
    */
    function changeStore(string memory newStore) external onlyProxy() onlyOwner() {
        emit ChangeStoreEvent(store, newStore);
        store = newStore;
    }

    function _authorizeUpgrade(address) internal override onlyOwner {}
}