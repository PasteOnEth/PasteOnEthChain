// SPDX-License-Identifier: GPL-3.0

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/proxy/ERC1967/ERC1967Proxy.sol";

/**
@title A proxy contract to save pastes from pasteoneth.com to eth
@author https://www.linkedin.com/in/omkar-pathak/
@notice This is a proxy contract with a UUPSUpgrabale implementation contract for managing pastes operations. 
*/
contract PasteOnEthProxy is ERC1967Proxy {
    /**
    @param initImplAddress The UUPSUpgrabale implementation contract address
    @param _data Additional encoded byte data used to call the initialize function of the implementation contract
    */
    constructor (address payable initImplAddress, bytes memory _data) ERC1967Proxy(initImplAddress, _data) {
    }
}