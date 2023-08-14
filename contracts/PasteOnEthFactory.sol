// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import {ClonesUpgradeable} from "@openzeppelin/contracts-upgradeable/proxy/ClonesUpgradeable.sol";
import {PasteOnEth} from "./PasteOnEth.sol";

contract PasteOnEthFactory is OwnableUpgradeable {
    address public implementation;

    event ProxyAddress(address proxy);

    constructor(address _implementation) {
        implementation = _implementation;
    }

    function initialize(address _initialOwner) initializer external {
        transferOwnership(_initialOwner);
    }

    function createPasteOnEth(address payable requesterAddress, string memory store) public returns (address) {
        address deployedAddress = ClonesUpgradeable.clone(implementation);
        PasteOnEth(deployedAddress).initialize(requesterAddress, store);
        // emit ProxyAddress(deployedAddress);
        return deployedAddress;
    }
}
