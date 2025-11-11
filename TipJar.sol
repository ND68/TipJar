// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

/**
 * @title TipJar
 * @dev A decentralized tipping platform that allows users to send Ether
 * and an optional message, while tracking contributions for a leaderboard.
 */
contract TipJar {
    // The address that deployed the contract, who is the only one who can withdraw tips
    address payable public owner;

    // Map to track the total accumulated tips (in Wei) sent by each address.
    mapping(address => uint256) public contributors;

    // Mapping from contributor address to nickname
    mapping(address => string) public nicknames;

    // For enumerating unique contributors
    address[] public allContributorsList;

    // A struct to record the details of a tip.
    struct Tip {
        address sender;
        uint256 amount;
        string message;
        string nickname;
        uint256 timestamp;
    }

    // Array to store all tip records. This is used to build the complete tip feed/history.
    Tip[] private tipHistory;

    // Event emitted when a tip is successfully sent
    event TipSent(address indexed sender, uint256 amount, string message, string nickname, uint256 timestamp);

    // Event emitted when the owner withdraws funds.
    event Withdrawal(address indexed receiver, uint256 amount);

    // Restricts function calls to the contract owner.
    modifier onlyOwner() {
        require(msg.sender == owner, "Only the owner can call this function.");
        _;
    }

    // Executed only once upon deployment, setting the deployer as the owner.
    constructor(address _owner) payable {
        owner = payable(_owner);
    }

    // Core Tipping Function
    function tip(string memory _message, string memory _nickname) public payable {
        require(msg.value > 0, "Tip amount must be greater than zero.");

        // If first-time contributor, add to list
        if (contributors[msg.sender] == 0) {
            allContributorsList.push(msg.sender);
        }

        // Store nickname if provided (overwrite existing if desired)
        if (bytes(_nickname).length > 0) {
            nicknames[msg.sender] = _nickname;
        }

        // Update Leaderboard data
        contributors[msg.sender] += msg.value;

        // Record history
        tipHistory.push(Tip(
            msg.sender,
            msg.value,
            _message,
            _nickname,
            block.timestamp
        ));

        // Notify frontend of new tip
        emit TipSent(msg.sender, msg.value, _message, _nickname, block.timestamp);
    }

    function getTipCount() public view returns (uint256) {
        return tipHistory.length;
    }

    function getTipByIndex(uint256 _index) public view returns (address, uint256, string memory, uint256) {
        require(_index < tipHistory.length, "Index out of bounds.");
        Tip storage t = tipHistory[_index];
        return (t.sender, t.amount, t.message, t.timestamp);
    }

    // For getting the arrays needed to form a leaderboard. Will do sorting off chain to save gas
    function getContributors() public view returns (address[] memory, uint256[] memory, string[] memory) {
        uint256 length = allContributorsList.length;
        uint256[] memory amounts = new uint256[](length);
        string[] memory names = new string[](length);

        for (uint256 i = 0; i < length; i++) {
            amounts[i] = contributors[allContributorsList[i]];
            names[i] = nicknames[allContributorsList[i]];
        }

        return (allContributorsList, amounts, names);
    }

    function getTipHistory() public view returns (address[] memory, uint256[] memory, string[] memory, string[] memory, uint256[] memory) {
        uint256 length = tipHistory.length;

        address[] memory senders = new address[](length);
        uint256[] memory amounts = new uint256[](length);
        string[] memory messages = new string[](length);
        string[] memory names = new string[](length);
        uint256[] memory timestamps = new uint256[](length);

        for (uint256 i = 0; i < length; i++) {
            Tip storage t = tipHistory[i];
            senders[i] = t.sender;
            amounts[i] = t.amount;
            messages[i] = t.message;
            names[i] = nicknames[t.sender];
            timestamps[i] = t.timestamp;
        }

        return (senders, amounts, messages, names, timestamps);
    }


    // For owners to withdraw
    function withdraw() public onlyOwner {
        uint256 balance = address(this).balance;
        
        // This is the recommended secure pattern for sending Ether (Checks-Effects-Interactions).
        (bool success, ) = owner.call{value: balance}("");
        require(success, "Withdrawal failed.");

        emit Withdrawal(owner, balance);
    }
}