// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";

contract PasteOnEth is Initializable {
    using Strings for uint256;
    
    string public store;
    address public requesterAddress;

    function initialize(address payable requesterAddressParam, string memory storeParam) public
        initializer {
            requesterAddress = requesterAddressParam;
            store = storeParam;
    }

    function changeStore(string memory newStore) external {
        store = newStore;
    }
}