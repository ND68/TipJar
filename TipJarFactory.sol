// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./TipJar.sol";

/**
 * @title TipJarFactory
 * @dev A contract factory used to deploy TipJar contracts for everyone
 */
contract TipJarFactory {
    // Mapping from creator address to their TipJar addresses
    mapping(address => address[]) public tipJarsOf;
    event TipJarCreated(address indexed creator, address tipJar);

    function createMyTipJar() external {
        TipJar jar = new TipJar(msg.sender);
        
        tipJarsOf[msg.sender].push(address(jar));

        emit TipJarCreated(msg.sender, address(jar));
    }
}