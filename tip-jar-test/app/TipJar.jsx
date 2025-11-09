import { useAccount, useWriteContract } from 'wagmi';
import { parseEther, encodeFunctionData } from 'viem';
import { sepolia } from 'viem/chains';
import { useState } from 'react';

const CONTRACT_ADDRESS = "0x3Afb376d4f940cdde506F2E65A15f67C11F6AA9f"; //make variable later
const TIP_AMOUNT = '0.002'; // Default tip amount in ETH
const MESSAGE = "Here's a tip!"; // Default message

// ABI for precisely defining tip function
const TIP_JAR_ABI = [
  {
    "inputs": [{"internalType": "string", "name": "_message", "type": "string"}],
    "name": "tip",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  }
];

const TipJarApp = () => {
    const { isConnected } = useAccount();
    const [status, setStatus] = useState('Ready to connect.');

    // Transaction handling hooks
    const { writeContract, data: txHash, isPending } = useWriteContract();

    const handleTip = () => {
        if (!isConnected) return setStatus('Connect wallet first.');

        writeContract({
        address: CONTRACT_ADDRESS,
        abi: TIP_JAR_ABI,
        functionName: 'tip',
        args: ["Here's a tip!"],
        value: parseEther('0.002'),
        chainId: sepolia.id,
        });
    };

    return (
        <div></div>
    );
}

export default TipJarApp;