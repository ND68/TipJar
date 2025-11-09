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

    // A struct to record the details of a tip.
    struct Tip {
        address sender;
        uint256 amount;
        string message;
        uint256 timestamp;
    }

    // Array to store all tip records. This is used to build the complete tip feed/history.
    Tip[] private tipHistory;

    // Event emitted when a tip is successfully sent
    event TipSent(address indexed sender, uint256 amount, string message, uint256 timestamp);

    // Event emitted when the owner withdraws funds.
    event Withdrawal(address indexed receiver, uint256 amount);

    // Restricts function calls to the contract owner.
    modifier onlyOwner() {
        require(msg.sender == owner, "Only the owner can call this function.");
        _;
    }

    // Executed only once upon deployment, setting the deployer as the owner.
    constructor() payable {
        owner = payable(msg.sender);
    }

    // Core Tipping Function
    function tip(string memory _message) public payable {
        require(msg.value > 0, "Tip amount must be greater than zero.");

        // Update Leaderboard data
        contributors[msg.sender] += msg.value;

        // Record history
        tipHistory.push(Tip(
            msg.sender,
            msg.value,
            _message,
            block.timestamp
        ));

        // Notify frontend of new tip
        emit TipSent(msg.sender, msg.value, _message, block.timestamp);
    }

    function getTipCount() public view returns (uint256) {
        return tipHistory.length;
    }

    function getTipByIndex(uint256 _index) public view returns (address, uint256, string memory, uint256) {
        require(_index < tipHistory.length, "Index out of bounds.");
        Tip storage t = tipHistory[_index];
        return (t.sender, t.amount, t.message, t.timestamp);
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