// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract OlaPoints is ERC20, Ownable {
    bool public transfersEnabled = false;

    constructor(string memory name, string memory symbol) ERC20(name, symbol) {
        _mint(_msgSender(), 1000000 * (10 ** decimals()));
    }

    function mint(address to, uint256 amount) public onlyOwner {
        _mint(to, amount);
    }

    function batchTransfer(
        address[] memory recipients,
        uint256[] memory amounts
    ) public onlyOwner {
        require(
            recipients.length == amounts.length,
            "Recipients and amounts arrays must be the same length."
        );

        for (uint256 i = 0; i < recipients.length; i++) {
            _transfer(_msgSender(), recipients[i], amounts[i]);
        }
    }

    function enableTransfers() public onlyOwner {
        transfersEnabled = true;
    }

    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 amount
    ) internal virtual override {
        require(
            transfersEnabled || _msgSender() == owner(),
            "Transfers are disabled."
        );
        super._beforeTokenTransfer(from, to, amount);
    }
}
