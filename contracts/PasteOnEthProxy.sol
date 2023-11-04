// SPDX-License-Identifier: GPL-3.0

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/proxy/ERC1967/ERC1967Proxy.sol";

contract PasteOnEthProxy is ERC1967Proxy {

    constructor (address payable initImplAddress, bytes memory _data) ERC1967Proxy(initImplAddress, _data) {
    }
}