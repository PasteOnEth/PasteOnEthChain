// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/proxy/utils/UUPSUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";


contract PasteOnEthImpl is UUPSUpgradeable, Initializable, OwnableUpgradeable {
    string public store;
    address private admin;
    
    event AdminTransferred(address indexed previousAdmin, address indexed newAdmin);

    modifier onlyAdmin() {
        require(msg.sender == admin);
        _;
    }

    /**
     * @dev Transfers ownership of the contract to a new account (`newOwner`).
     * Can only be called by the current owner.
     */
    function transferAdmin(address newAdmin) public virtual onlyAdmin {
        require(newAdmin != address(0), "New admin is the zero address");
        _transferAdmin(newAdmin);
    }

    /**
     * @dev Transfers ownership of the contract to a new account (`newOwner`).
     * Internal function without access restriction.
     */
    function _transferAdmin(address newAdmin) internal virtual {
        address oldAdmin = admin;
        admin = newAdmin;
        emit AdminTransferred(oldAdmin, newAdmin);
    }

    constructor () {
        admin = msg.sender;
        _disableInitializers();
    }

    function initialize(string memory initStore) external initializer {
        __Ownable_init();
        store = initStore;
    }

    function changeStore(string memory newStore) external onlyProxy() onlyOwner() {
        store = newStore;
    }

    function _authorizeUpgrade(address) internal override onlyAdmin {}
}