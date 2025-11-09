import React, { useState, useMemo } from 'react';
import { useAccount, useSendTransaction, useWaitForTransactionReceipt, useConfig } from 'wagmi';
import { createPublicClient, http } from 'viem';
import { sepolia } from 'viem/chains';
import { parseEther } from 'viem';

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
    const { address: connectedAddress, isConnected } = useAccount();
    const config = useConfig();
    const [status, setStatus] = useState('Ready to connect.');

    // Creates link to an Ethereum node
    const publicClient = useMemo(() => createPublicClient({ 
        chain: sepolia, 
        transport: http()
    }), [config]);

    // Transaction handling hooks
    const { data: tipHash, sendTransaction } = useSendTransaction();
    const { isLoading: isTipConfirming, isSuccess: isTipConfirmed } = useWaitForTransactionReceipt({ hash: tipHash });

    // Encodes the tip function call
    const encodeTipData = useMemo(() => {
        return publicClient.abi.encodeFunctionData({
            abi: TIP_JAR_ABI,
            functionName: 'tip',
            args: [MESSAGE]
        });
    }, [publicClient]);

    const handleTip = () => {
        if (!isConnected) {
            setStatus('Please connect your wallet first.');
            return;
        }

        setStatus(`Sending ${TIP_AMOUNT} ETH...`);

        try {
            sendTransaction({
                to: CONTRACT_ADDRESS,
                data: encodeTipData,
                value: parseEther(TIP_AMOUNT), // Converts ETH string to Wei BigInt
                chainId: sepolia.id
            });
        } catch (error) {
            console.error("Transaction Error:", error);
            setStatus(`Transaction error: ${error.message}`);
        }
    };

}