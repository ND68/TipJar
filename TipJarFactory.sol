// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./TipJar.sol";

/**
 * @title TipJarFactory
 * @dev A contract factory used to deploy TipJar contracts for everyone
 */
contract TipJarFactory {
    mapping(address => address) public tipJarOf;
    event TipJarCreated(address indexed creator, address tipJar);

    function createMyTipJar() external {
        require(tipJarOf[msg.sender] == address(0), "TipJar already exists");

        TipJar jar = new TipJar(msg.sender);
        tipJarOf[msg.sender] = address(jar);

        emit TipJarCreated(msg.sender, address(jar));
    }
}