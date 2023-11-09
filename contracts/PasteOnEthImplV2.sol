// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/proxy/utils/UUPSUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";


contract PasteOnEthImplV2 is UUPSUpgradeable, Initializable, OwnableUpgradeable {
    string public store;

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